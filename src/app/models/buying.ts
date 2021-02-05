import { Moment } from "moment"

export interface Buying {
  id: string;
  productId: string;
  isBought: number;
  boughtTime?: Moment;
  quantity?: number;
  price?: number;
  unitPrice?: number;
  unitSalePrice?: number;
  lastTimeUpdated: Moment;
}
