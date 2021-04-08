import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonList, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Buying } from 'src/app/models/buying';
import { BuyingAction } from 'src/app/models/buying-action';
import { BuyingDate } from 'src/app/models/buying-date';
import { BuyingOverview } from 'src/app/models/buying-overview';
import { BuyingService } from 'src/app/services/buying.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ModalService } from 'src/app/services/modal.service';

type TO_BUY = 'to_buy';
const TO_BUY = 'to_buy';

@Component({
  selector: 'app-buyings-tab',
  templateUrl: './buyings-tab.page.html',
  styleUrls: ['./buyings-tab.page.scss'],
})
export class BuyingsTabPage implements OnInit, OnDestroy {
  @ViewChild(IonList) ionList: IonList;

  subscription = new Subscription();
  buyings: BuyingOverview[];
  totalToBuy = 0;
  previuos: BuyingDate[];
  expanded: { [key: string]: boolean } = {};
  groupItems: { [key: string]: BuyingOverview[] } = {};
  toBuyChecks: { [key: string]: boolean } = {};
  toBuySelectionMode = false;

  groupSelections: { [key: string]: { selecting: boolean, items: { [key: string]: boolean } } } = {};
  selectionModeTarget = new Map<TO_BUY | string, void>(); // if it's TO_BUY, target to `toBuyChecks` else target to specific group in `groupSelections`
  showFab = true;

  constructor(private buyingSrv: BuyingService,
    private toastCtrl: ToastController,
    private dbSrv: DatabaseService,
    private modalSrv: ModalService) { }

  ngOnInit() {
    this.init();

    const s = this.dbSrv.onDbImported.subscribe(() => this.init());
    this.subscription.add(s);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  private init() {
    this.getBuyings();
    this.getPreviousLists();
  }

  async getBuyings(event?: CustomEvent) {
    this.getTotalToBuy();
    this.buyings = await this.buyingSrv.findPendingBuyings(event?.detail.value);
    this.quitSelectMode();
  }

  async getTotalToBuy() {
    this.totalToBuy = await this.buyingSrv.getTotalToBuy();
  }
  
  async getPreviousLists() {
    this.previuos = await this.buyingSrv.getBuyingDates();

    if (this.previuos.length > 0) {
      const bDate = this.previuos[0].boughtDate;
      if (this.expanded[bDate] === undefined) { // if user has not expanded it by themself
        this.expanded[bDate] = true;
      }
      this.getBuyingsGroup(bDate, true);
    }
  }

  async showBuyingModal(action: BuyingAction, productId: string, buyingId?: string) {
    const {buyingId: savedId} = await this.modalSrv.showBuyingModal(action, productId, buyingId);
    if (savedId) {
      this.getBuyings();
      this.getPreviousLists();
    }
  }

  async showSelectProductModal() {
    const {productId} = await this.modalSrv.showSelectProductModal();
    if (productId) {
      this.showBuyingModal('add', productId);
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

  getBuyingsGroup(boughtDate: string, reaload = false) {
    if (!this.groupItems[boughtDate] || reaload) {
      this.buyingSrv.getBuyingsByDate(boughtDate).then(b => this.groupItems[boughtDate] = b);
    }
  }

  @HostListener('click')
  onClick() {
    this.ionList.closeSlidingItems();
  }

  onScroll(e: CustomEvent) {
    if (e.detail.velocityY < 0) { // scrolling up
      this.showFab = true;
    } else if (e.detail.velocityY > 0) { // scrolling down
      this.showFab = false;
    }
  }

  toggleToBuyItem(buyingId: string) {
    this.toBuyChecks[buyingId] = !this.toBuyChecks[buyingId];
    if (this.someIsTrue(this.toBuyChecks)) {
      this.toBuySelectionMode = true;
      this.selectionModeTarget.set(TO_BUY);
      this.showFab = true;
    } else {
      this.toBuySelectionMode = false;
      this.selectionModeTarget.delete(TO_BUY);
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

  toggleToBuySelection() {
    this.toBuySelectionMode = !this.toBuySelectionMode;
    if (this.toBuySelectionMode) {
      this.selectionModeTarget.set(TO_BUY);
    } else {
      this.selectionModeTarget.delete(TO_BUY);
    }
  }

  async deleteBuyings() {
    const groups = Array.from(this.selectionModeTarget.keys());
    const selected = this.getAllIds(groups);
    if (selected.length === 0) return;

    await this.doDelete(selected);
    this.clearAllSelections();
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

    if (this.groupSelections[groupId].selecting) {
      this.selectionModeTarget.set(groupId);
      this.showFab = true;
    } else {
      this.selectionModeTarget.delete(groupId);
    }
  }

  toggleGroupSelection(groupId: string) {
    if (!this.groupSelections[groupId]) {
      this.groupSelections[groupId] = { selecting: true, items: {} };
    } else {
      this.groupSelections[groupId].selecting = !this.groupSelections[groupId].selecting;
    }
    if (this.groupSelections[groupId].selecting) {
      this.selectionModeTarget.set(groupId);
    } else {
      this.selectionModeTarget.delete(groupId);
      this.removeGroupSelection(groupId);
    }
    if (!this.expanded[groupId]) {
      this.toggleExpanded(groupId);
    }
  }

  removeGroupSelection(groupId: string) {
    this.groupSelections[groupId] = { selecting: false, items: {} };
  }

  async rebuyItems() {
    const groups = Array.from(this.selectionModeTarget.keys());
    const ids = this.getAllIds(groups);

    if (ids.length === 0) return;

    const toRebuy: Buying[] = (await this.buyingSrv.findAllById(ids)).map(b => ({
      ...b,
      isBought: 0,
      boughtTime: null,
      unitPrice: null,
      unitSalePrice: null,
      lastTimeUpdated: null
    }));

    const inserted = await Promise.all(toRebuy.map(b => this.buyingSrv.insert(b)));
    this.clearAllSelections();
    this.getBuyings();
    this.showRebuyToast(inserted);
  }

  private getAllIds(groups: string[]) {
    const ids = [];
    for (const group of groups) {
      const items = group === TO_BUY ? this.toBuyChecks : this.groupSelections[group].items;
      this.getAllTrue(items).forEach(i => ids.push(i));
    }
    return ids;
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

  clearAllSelections() {
    for (const group of this.selectionModeTarget.keys()) {
      group === TO_BUY ? this.quitSelectMode() : this.removeGroupSelection(group);
    }
    this.selectionModeTarget.clear();
  }
}
