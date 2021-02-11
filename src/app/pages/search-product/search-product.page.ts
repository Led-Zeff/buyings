import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.page.html',
  styleUrls: ['./search-product.page.scss'],
})
export class SearchProductPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;
  
  products: Product[] = [];
  loadedCount = 0;
  filter = '';

  constructor(private productSrv: ProductService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.getProducts(30);
  }

  search(event: CustomEvent) {
    this.filter = event.detail.value
    this.resetProducts();
    this.getProducts(30);
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

  resetProducts() {
    this.products = [];
    this.loadedCount = 0;
    this.infinite.disabled = false;
  }

  dismissModal(productId: string) {
    this.modalCtrl.dismiss({ productId });
  }

  getProductId(index: number, product: Product) {
    return product.id + product.lastTimeUpdated;
  }
}
