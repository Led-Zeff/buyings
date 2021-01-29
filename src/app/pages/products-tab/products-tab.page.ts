import { Component, OnInit } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { randomIcon } from 'src/app/utils/product-icons';
import { ProductPage } from '../product/product.page';

@Component({
  selector: 'app-products-tab',
  templateUrl: './products-tab.page.html',
  styleUrls: ['./products-tab.page.scss'],
})
export class ProductsTabPage implements OnInit {
  products: {product: Product, icon: string}[] = [];
  loadedCount = 0;

  constructor(private modalCtrl: ModalController, private productSrv: ProductService) { }

  ngOnInit() {
    this.resetProducts();
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
    const prods = (await this.productSrv.getProducts(quantity, this.loadedCount)).map(product => ({product, icon: randomIcon()}));
    this.products = this.products.concat(prods);
    this.loadedCount += quantity;
  }

  async infiniteEvent(infinite: IonInfiniteScroll) {
    const prevLength = this.products.length;
    await this.getProducts(20);
    infinite.complete();
    if (prevLength === this.products.length) {
      infinite.disabled = true;
    }
  }

  getProductUpdTime(index: number, {product}: {product: Product}) {
    return product.id + product.lastTimeUpdated;
  }

  resetProducts() {
    this.products = [];
    this.loadedCount = 0;
    this.getProducts(30);
  }
}
