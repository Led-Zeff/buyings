import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, ToastController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { ProductPage } from '../product/product.page';

@Component({
  selector: 'app-products-tab',
  templateUrl: './products-tab.page.html',
  styleUrls: ['./products-tab.page.scss'],
})
export class ProductsTabPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  products: Product[] = [];
  loadedCount = 0;
  filter = '';

  constructor(private modalCtrl: ModalController, private productSrv: ProductService, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.getProducts(30);
  }

  async showProductModal(product?: Product) {
    const modal = await this.modalCtrl.create({
      component: ProductPage,
      componentProps: {
        product
      }
    });

    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data?.productId) {
      this.resetProducts();
      this.getProducts(30);

      if (data.action === 'delete') {
        this.showDeleteToast(data.productId);
      }
    }
  }

  async showDeleteToast(productId: string) {
    const toast = await this.toastCtrl.create({
      message: 'Producto eliminado',
      duration: 10000,
      buttons: [{
        side: 'start',
        icon: 'close'
      }, {
        side: 'end',
        text: 'Deshacer',
        handler: async () => {
          await this.productSrv.reactivateProduct(productId);
          this.resetProducts();
          this.getProducts(30);
        }
      }]
    });

    await toast.present();
  }

  async getProducts(quantity: number) {
    const prods = await this.productSrv.findProducts(this.filter, quantity, this.loadedCount);
    this.products = this.products.concat(prods);
    this.loadedCount += quantity;
  }

  async infiniteEvent() {
    const prevLength = this.products.length;
    await this.getProducts(20);
    this.infinite.complete();
    if (prevLength === this.products.length) {
      this.infinite.disabled = true;
    }
  }

  getProductUpdTime(index: number, product: Product) {
    return index + product.lastTimeUpdated;
  }

  resetProducts() {
    this.products = [];
    this.loadedCount = 0;
    this.infinite.disabled = false;
  }

  search(event: CustomEvent) {
    this.filter = event.detail.value;
    this.resetProducts();
    this.getProducts(30);
  }

  async refresh(event) {
    this.resetProducts();
    await this.getProducts(30);
    event.target.complete();
  }
}
