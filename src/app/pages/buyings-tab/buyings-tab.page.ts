import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonList, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Buying } from 'src/app/models/buying';
import { BuyingAction } from 'src/app/models/buying-action';
import { BuyingDate } from 'src/app/models/buying-date';
import { BuyingOverview } from 'src/app/models/buying-overview';
import { BuyingService } from 'src/app/services/buying.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FileService } from 'src/app/services/file.service';
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
  previuos: BuyingDate[];
  expanded: { [key: string]: boolean } = {};
  groupItems: { [key: string]: {subject: BehaviorSubject<BuyingOverview[]>, observable: Observable<BuyingOverview[]>} } = {};
  toBuyChecks: { [key: string]: boolean } = {};
  toBuySelectionMode = false;

  groupSelections: { [key: string]: { selecting: boolean, items: { [key: string]: boolean } } } = {};

  constructor(private modalCtrl: ModalController,
    private buyingSrv: BuyingService,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private databaseSrv: DatabaseService,
    private fileSrv: FileService) { }

  ngOnInit() {
    this.getBuyings();
    this.getPreviousLists();
  }

  async getBuyings(event?: CustomEvent) {
    this.buyings = await this.buyingSrv.findPendingBuyings(event?.detail.value);
    this.quitSelectMode();
  }
  
  async getPreviousLists() {
    this.previuos = await this.buyingSrv.getBuyingDates();

    if (this.previuos.length > 0) {
      const bDate = this.previuos[0].boughtDate;
      if (this.expanded[bDate] === undefined) { // if user has not expanded it by themself
        this.expanded[bDate] = true;
      }
      this.getBuyingsGroup(bDate);
    }
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
      this.getPreviousLists();
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

  toggleExpanded(boughtDate: string) {
    this.expanded[boughtDate] = !this.expanded[boughtDate];
    this.getBuyingsGroup(boughtDate);
  }

  isExpanded(boughtDate: string): boolean {
    return this.expanded[boughtDate];
  }

  getBuyingsGroup(boughtDate: string) {
    if (!this.groupItems[boughtDate]) {
      const subject = new BehaviorSubject<BuyingOverview[]>([]);
      this.groupItems[boughtDate] = { subject, observable: subject.asObservable() };
    }

    this.buyingSrv.getBuyingsByDate(boughtDate).then(b => this.groupItems[boughtDate].subject.next(b));
  }

  @HostListener('click')
  onClick() {
    this.ionList.closeSlidingItems();
  }

  toggleToBuyItem(buyingId: string) {
    this.toBuyChecks[buyingId] = !this.toBuyChecks[buyingId];
    if (this.someIsTrue(this.toBuyChecks)) {
      if (!this.toBuySelectionMode) this.toBuySelectionMode = true;
    } else {
      if (this.toBuySelectionMode) this.toBuySelectionMode = false;
    }
  }

  quitSelectMode() {
    this.toBuySelectionMode = false;
    this.toBuyChecks = {};
  }

  someIsTrue(items: { [key: string]: boolean }): boolean {
    for (const key in items) {
      if (Object.prototype.hasOwnProperty.call(items, key) && items[key] === true) {
        return true;
      }
    }
    return false;
  }

  getAllTrue(items: { [key: string]: boolean }): string[] {
    const selected = [];
    for (const key in items) {
      if (Object.prototype.hasOwnProperty.call(items, key) && items[key] === true) {
        selected.push(key);
      }
    }
    return selected;
  }

  async showActionSheet() {
    const sheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: 'Editar',
        handler: () => this.toBuySelectionMode = true
      }, {
        text: 'Exportar base de datos',
        handler: () => this.exportHandler()
      }, {
        text: 'Importar base de datos',
        handler: async () => this.importHandler()
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await sheet.present();
  }

  async importHandler() {
    await this.databaseSrv.importDatabase();
    const toast = await this.toastCtrl.create({
      message: 'Base de datos importada correctamente',
      duration: 5000,
      buttons: [{ icon: 'close', side: 'start' }]
    });
    toast.present();
  }

  async exportHandler() {
    const createdFilePath = await this.databaseSrv.exportDatabase();
    const toast = await this.toastCtrl.create({
      message: 'Archivo creado',
      duration: 20000,
      buttons: [{
        side: 'start',
        icon: 'close'
      }, {
        side: 'end',
        text: 'Compartir',
        handler: () => this.fileSrv.shareFile('Database file', createdFilePath)
      }]
    });

    await toast.present();
  }

  async deleteBuyings() {
    const selected = this.getAllTrue(this.toBuyChecks);
    await this.doDelete(selected);
  }

  async doDelete(ids: string[]) {
    const buyingsToDelete = await this.buyingSrv.findAllById(ids);
    await this.buyingSrv.deleteAll(ids);
    this.getBuyings();

    const toast = await this.toastCtrl.create({
      message: ids.length > 1 ? `${ids.length} compras eliminadas` : 'Compra eliminada',
      duration: 10000,
      buttons: [{
        side: 'start',
        icon: 'close'
      }, {
        side: 'end',
        text: 'Deshacer',
        handler: async () => {
          await Promise.all(buyingsToDelete.map((b) => this.buyingSrv.insert(b)));
          this.getBuyings();
        }
      }]
    });

    await toast.present();
  }

  toggleInGroup(groupId: string, item: string) {
    if (!this.groupSelections[groupId]) {
      this.groupSelections[groupId] = { selecting: true, items: { [item]: true } };
    } else {
      const group = this.groupSelections[groupId];
      group.items[item] = !group.items[item];
      group.selecting = this.someIsTrue(group.items);
    }
  }

  toggleGroupSelection(groupId: string) {
    if (!this.groupSelections[groupId]) {
      this.groupSelections[groupId] = { selecting: true, items: {} };
    } else {
      this.groupSelections[groupId].selecting = !this.groupSelections[groupId].selecting;
    }
  }

  removeGroupSelection(groupId: string) {
    this.groupSelections[groupId] = { selecting: false, items: {} };
  }

  async rebuyItems(groupId: string) {
    const ids = this.getAllTrue(this.groupSelections[groupId].items);
    const toRebuy: Buying[] = (await this.buyingSrv.findAllById(ids)).map(b => ({
      ...b,
      isBought: 0,
      boughtTime: null,
      unitPrice: null,
      unitSalePrice: null,
      lastTimeUpdated: null
    }));

    const inserted = await Promise.all(toRebuy.map(b => this.buyingSrv.insert(b)));
    this.removeGroupSelection(groupId);
    this.getBuyings();
    this.showRebuyToast(inserted);
  }

  async showRebuyToast(ids: string[]) {
    const toast = await this.toastCtrl.create({
      message: ids.length > 1 ? `${ids.length} compras agregadas` : 'Compra agregada',
      duration: 10000,
      buttons: [{
        side: 'start',
        icon: 'close'
      }, {
        side: 'end',
        text: 'Deshacer',
        handler: async () => {
          this.doDelete(ids);
        }
      }]
    });

    await toast.present();
  }
}
