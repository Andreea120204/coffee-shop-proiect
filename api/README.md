# RW API

Mock REST API. 

## Setup

   ```bash
   npm install
   ```

## Running the API

```bash
npm start
```

By default the server listens on `http://localhost:8055`.

## Endpoints

### `GET /products`

Returns the list of products with embedded reviews.

### `POST /products/:productId/reviews`

Adds a review to a product. Body parameters:

| Field   | Type   | Required | Notes                                  |
|---------|--------|----------|----------------------------------------|
| `text`  | string | yes      | Review content; trimmed before saving. |
| `rating`| number | yes      | Integer 1-5.                           |

Sample request:

```bash
curl -X POST http://localhost:8055/products/pour-over-kit/reviews \
  -H "Content-Type: application/json" \
  -d '{"text": "Great bloom control.", "rating": 4}'
```

Successful responses return the updated product along with all reviews. Errors use conventional HTTP status codes (400 for validation issues, 404 if the product ID does not exist, 500 for server errors).
