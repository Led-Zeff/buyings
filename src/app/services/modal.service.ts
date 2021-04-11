import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BuyingAction } from '../models/buying-action';
import { Category } from '../models/category';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalCtrl: ModalController) { }

  async showProductModal(component: any, product?: Product): Promise<{ productId?: string, action?: 'edit' | 'delete' }> {
    const modal = await this.modalCtrl.create({
      component,
      componentProps: {
        product
      }
    });

    await modal.present();
    const {data} = await modal.onDidDismiss();
    return { productId: data?.productId, action: data?.action }
  }

  async showSelectProductModal(component: any): Promise<{productId?: string}> {
    const modal = await this.modalCtrl.create({
      component
    });

    await modal.present();
    const {data} = await modal.onDidDismiss();
    return { productId: data?.productId };
  }

  async showBuyingModal(component: any, action: BuyingAction, productId: string, buyingId?: string): Promise<{buyingId: string}> {
    const modal = await this.modalCtrl.create({
      component,
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

  async showCategoryModal(component: any,category?: Category) {
    const modal = await this.modalCtrl.create({
      component,
      componentProps: {
        category
      }
    });

    await modal.present();
    const {data} = await modal.onDidDismiss();
    return data?.category as Category;
  }
}
