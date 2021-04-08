import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BuyingAction } from '../models/buying-action';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { BuyingPage } from '../pages/buying/buying.page';
import { CategoryPage } from '../pages/category/category.page';
import { ProductPage } from '../pages/product/product.page';
import { SearchProductPage } from '../pages/search-product/search-product.page';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalCtrl: ModalController) { }

  async showProductModal(product?: Product): Promise<{ productId?: string, action?: 'edit' | 'delete' }> {
    const modal = await this.modalCtrl.create({
      component: ProductPage,
      componentProps: {
        product
      }
    });

    await modal.present();
    const {data} = await modal.onDidDismiss();
    return { productId: data?.productId, action: data?.action }
  }

  async showSelectProductModal(): Promise<{productId?: string}> {
    const modal = await this.modalCtrl.create({
      component: SearchProductPage
    });

    await modal.present();
    const {data} = await modal.onDidDismiss();
    return { productId: data?.productId };
  }

  async showBuyingModal(action: BuyingAction, productId: string, buyingId?: string): Promise<{buyingId: string}> {
    const modal = await this.modalCtrl.create({
      component: BuyingPage,
      componentProps: {
        productId,
        buyingId,
        action
      }
    });

    await modal.present();
    const {data} = await modal.onDidDismiss();
    return { buyingId: data?.buyingId };
  }

  async showCategoryModal(category?: Category) {
    const modal = await this.modalCtrl.create({
      component: CategoryPage,
      componentProps: {
        category
      }
    });

    await modal.present();
    const {data} = await modal.onDidDismiss();
    return data?.category as Category;
  }
}
