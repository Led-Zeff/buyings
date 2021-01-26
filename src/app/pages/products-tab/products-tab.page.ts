import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductPage } from '../product/product.page';

@Component({
  selector: 'app-products-tab',
  templateUrl: './products-tab.page.html',
  styleUrls: ['./products-tab.page.scss'],
})
export class ProductsTabPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async showProductModal() {
    const modal = await this.modalCtrl.create({
      component: ProductPage
    });
    await modal.present();
  }

}
