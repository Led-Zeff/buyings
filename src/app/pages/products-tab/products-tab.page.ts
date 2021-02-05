import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
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

  constructor(private modalCtrl: ModalController, private productSrv: ProductService) { }

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
    }
  }

  async getProducts(quantity: number) {
    const prods = await this.productSrv.getProducts(quantity, this.loadedCount);
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
    this.getProducts(30);
    this.infinite.disabled = false;
  }
}
