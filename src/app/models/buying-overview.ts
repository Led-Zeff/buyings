export interface BuyingOverview {
  buyingId: string;
  productId: string;
  name: string;
  icon: string;
  packageType: string;
  contentQuantity: number;
  quantity: number;
  lastTimeUpdated: string;
  isBought: number;
  price: number;
  branch: string;
  lastUnitPrice?: number;
}
