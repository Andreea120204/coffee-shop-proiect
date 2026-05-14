const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "products.json");
const PORT = Number(process.env.PORT) || 8055;

const app = express();
app.use(express.json());

const allowOrigin = "*";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

async function readProductData() {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeProductData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get("/products", async (req, res) => {
  try {
    const data = await readProductData();
    res.json(data.products ?? []);
  } catch (error) {}
});

app.get("/products/:productId", async (req, res) => {
  try {
    const data = await readProductData();
    const needle = data.products.find(p => p.id === req.params.productId);
    res.json(needle ? [needle] : []);
  } catch (error) {
    console.error("Failed to fetch product", error);
    res.status(500).json({ error: "Unable to fetch product." });
  }
});

app.post("/products/:productId/reviews", async (req, res) => {
  const { productId } = req.params;
  const { text, rating } = req.body || {};

  const normalizedText = typeof text === "string" ? text.trim() : "";
  const ratingNumber = Number(rating);

  if (!normalizedText) {
    return res.status(400).json({ error: "Review text is required." });
  }

  if (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
    return res.status(400).json({ error: "Rating must be an integer between 1 and 5." });
  }

  try {
    const data = await readProductData();
    const products = data.products ?? [];
    const product = products.find(item => item.id === productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (!Array.isArray(product.reviews)) {
      product.reviews = [];
    }

    const newReview = {
      id: `${productId}-review-${Date.now()}`,
      text: normalizedText,
      rating: ratingNumber,
      createdAt: new Date().toISOString(),
    };

    product.reviews.push(newReview);
    await writeProductData(data);

    res.status(201).json({ product });
  } catch (error) {
    console.error(`Failed to add review for product ${productId}`, error);
    res.status(500).json({ error: "Unable to save review." });
  }
});

app.delete("/products/:productId/reviews/:reviewId", async (req, res) => {
  const { productId, reviewId } = req.params;

  // Verificare simpla de autentificare: cerem un Bearer token in header.
  // Tokenul nu este validat real (e mock), dar prezenta lui demonstreaza
  // ca clientul trimite headerul Authorization prin HttpInterceptor.
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Autentificare necesara." });
  }

  try {
    const data = await readProductData();
    const products = data.products ?? [];
    const product = products.find(item => item.id === productId);

    if (!product) {
      return res.status(404).json({ error: "Produsul nu a fost gasit." });
    }

    const initialCount = product.reviews?.length ?? 0;
    product.reviews = (product.reviews ?? []).filter(r => r.id !== reviewId);

    if (product.reviews.length === initialCount) {
      return res.status(404).json({ error: "Recenzia nu a fost gasita." });
    }

    await writeProductData(data);
    res.json({ product });
  } catch (error) {
    console.error(`Failed to delete review ${reviewId}`, error);
    res.status(500).json({ error: "Nu am putut sterge recenzia." });
  }
});

app.listen(PORT, () => {
  console.log(`Product API listening on port ${PORT}`);
});
