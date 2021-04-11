export interface Buying {
  id: string;
  productId: string;
  isBought: number;
  boughtTime?: string;
  quantity?: number;
  price?: number;
  unitPrice?: number;
  unitSalePrice?: number;
  lastTimeUpdated: string;
  branch: string;
}
