import { Review } from './review.model';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  reviews: Review[];
}
