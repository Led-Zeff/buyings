import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductOverview } from 'src/app/models/product-overview';
import { DatabaseService } from 'src/app/services/database.service';
import { ModalService } from 'src/app/services/modal.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductPage } from '../product/product.page';

@Component({
  selector: 'app-products-tab',
  templateUrl: './products-tab.page.html',
  styleUrls: ['./products-tab.page.scss'],
})
export class ProductsTabPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  subscription = new Subscription();
  products: ProductOverview[] = [];
  loadedCount = 0;
  filter = '';
  showFab = true;

  constructor(private modalSrv: ModalService,
    private productSrv: ProductService,
    private toastCtrl: ToastController,
    private menuController: MenuController,
    private dbService: DatabaseService) { }

  ngOnInit() {
    this.getProducts(30);
  }
  
  ngAfterViewInit() {
    this.dbService.onDbImported.subscribe(() => {
      this.resetProducts();
      this.getProducts(30);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onScroll(e: CustomEvent) {
    if (e.detail.velocityY < 0) { // scrolling up
      this.showFab = true;
    } else if (e.detail.velocityY > 0) { // scrolling down
      this.showFab = false;
    }
  }

  async showProductModal(product?: Product) {
    const {productId, action} = await this.modalSrv.showProductModal(product);
    if (productId) {
      this.resetProducts();
      this.getProducts(30);

      if (action === 'delete') {
        this.showDeleteToast(productId);
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

  openMenu() {
    this.menuController.open();
  }
}
