import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ModalController } from '@ionic/angular';
import { BuyingAction } from 'src/app/models/buying-action';
import { BuyingOverview } from 'src/app/models/buying-overview';
import { BuyingService } from 'src/app/services/buying.service';
import { BuyingPage } from '../buying/buying.page';
import { SearchProductPage } from '../search-product/search-product.page';

@Component({
  selector: 'app-buyings-tab',
  templateUrl: './buyings-tab.page.html',
  styleUrls: ['./buyings-tab.page.scss'],
})
export class BuyingsTabPage implements OnInit {
  @ViewChild(IonList) ionList: IonList;

  buyings: BuyingOverview[];

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController, private buyingSrv: BuyingService) { }

  ngOnInit() {
    this.getBuyings();
  }

  async getBuyings() {
    this.buyings = await this.buyingSrv.findBuyings(false, '');
  }

  async showBuyingModal(action: BuyingAction, productId: string, buyingId?: string) {
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
    if (data?.buyingId) {
      this.getBuyings();
    }
  }

  async showSelectProductModal() {
    const modal = await this.modalCtrl.create({
      component: SearchProductPage
    });

    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data?.productId) {
      this.showBuyingModal('add', data.productId);
    }
  }

  getBuyingId(index: number, buying: BuyingOverview) {
    return buying.buyingId + buying.lastTimeUpdated;
  }

  async confirmDelete(buying: BuyingOverview) {
    const alert = await this.alertCtrl.create({
      subHeader: `Eliminar compra ${buying.name}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.deleteBuying(buying.buyingId);
          }
        }
      ]
    });

    await alert.present();
  }

  private async deleteBuying(buyingId: string) {
    await this.buyingSrv.delete(buyingId);
    this.getBuyings();
  }

  @HostListener('click')
  onClick() {
    this.ionList.closeSlidingItems();
  }
}
