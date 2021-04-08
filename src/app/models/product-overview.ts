import { Product } from './product';

export interface ProductOverview extends Product {
  category: string;
  profitPercentage: number;
}
