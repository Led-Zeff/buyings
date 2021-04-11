import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, NavController, ToastController } from '@ionic/angular';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { ModalService } from 'src/app/services/modal.service';
import { CategoryPage } from '../category/category.page';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  @ViewChild(IonList) categoriesList: IonList;

  categories: Category[];
  showFab = true;

  constructor(private navCtrl: NavController,
    private modalSrv: ModalService,
    private categorySrv: CategoryService,
    private toastController: ToastController) { }

  ngOnInit() {
    this.getCategories();
  }

  async getCategories() {
    this.categories = await this.categorySrv.getAll();
  }

  onScroll(e: CustomEvent) {
    if (e.detail.velocityY < 0) { // scrolling up
      this.showFab = true;
    } else if (e.detail.velocityY > 0) { // scrolling down
      this.showFab = false;
    }
  }

  async showCategoryModal(category?: Category) {
    const saved = await this.modalSrv.showCategoryModal(CategoryPage, category);
    if (saved) {
      this.getCategories();
    }
  }

  async deleteCategory(category: Category) {
    const products = await this.categorySrv.getProductIdByCategory(category.id);
    await this.categorySrv.delete(category.id);
    this.getCategories();

    const toast = await this.toastController.create({
      message: 'Categoría eliminada',
      duration: 2000,
      buttons: [
        { side: 'start', icon: 'close' },
        { side: 'end', text: 'Deshacer', handler: () => this.undoDelete(category, products) }
      ]
    });
    toast.present();
  }

  async undoDelete(category: Category, products: string[]) {
    await this.categorySrv.insert(category);
    if (products.length > 0) {
      await this.categorySrv.updateProductsCategory(products, category.id);
    }
    this.getCategories();
  }
}
