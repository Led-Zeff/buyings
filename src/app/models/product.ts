import { Moment } from "moment";

export class Product {
  id: string;
  name: string;
  packageType: string;
  contentQuantity: number;
  lastBoughtTime: Moment;
  salePrice: number;
  deleted: boolean;
}
