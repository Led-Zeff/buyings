import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { randomIcon } from 'src/app/utils/product-icons';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  @Input() product: Product;

  productForm: FormGroup;
  packages: string[];
  categories: Category[];
  icons = {'PIEZA': 'pricetag-outline', 'LITRO': 'water-outline', 'KILO': 'cube-outline'};

  constructor(private modalCtrl: ModalController,
    private productSrv: ProductService,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private categorySrv: CategoryService) { }

  async ngOnInit() {
    this.productForm = this.fb.group({
      id: [],
      name: ['', [CustomValidators.notEmpty, CustomValidators.noSymbols] ],
      packageType: [],
      contentQuantity: [null, [Validators.required, Validators.min(1), CustomValidators.number] ],
      lastBoughtTime: [],
      salePrice: [null, [CustomValidators.decimal] ],
      lastTimeUpdated: [],
      deleted: [0],
      categoryId: []
    });

    await Promise.all([this.loadPackages(), this.loadCategories()]); // await for those, or the value will not display correctly in the form
    if (this.product) {
      this.productForm.patchValue(this.product);
    }
  }

  async loadPackages() {
    this.packages = await this.productSrv.getPackages();
  }

  async loadCategories() {
    this.categories = await this.categorySrv.getAll();
  }

  async newPackageDialog() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Nuevo tipo de empaquetado',
      inputs: [
        { 
          name: 'packaging',
          type: 'text',
          attributes: { required: true }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: ({packaging}) => {
            this.createPackage(packaging);
          }
        }
      ]
    });

    await alert.present();
  }

  async onSubmit() {
    this.productForm.markAllAsTouched();
    if (this.productForm.valid) {
      let id: string;
      const prod: Product = {...this.productForm.value, icon: this.icons[this.productForm.value.packageType] || randomIcon()};
      if (!this.product?.id) {
        id = await this.productSrv.newProduct(prod);
      } else {
        id = await this.productSrv.updateProduct(prod);
      }
      this.dismissModal('edit', id);
    }
  }

  async deleteProduct() {
    if (this.product?.id) {
      await this.productSrv.deactivateProduct(this.product.id);
      this.dismissModal('delete', this.product.id);
    }
  }

  private async createPackage(name: string) {
    if (name && name.trim() !== '') {
      const pack = await this.productSrv.newPackage(name);
      await this.loadPackages();
      this.productForm.controls.packageType.setValue(pack);
    }
  }

  dismissModal(action?: string, productId?: string) {
    this.modalCtrl.dismiss({ action, productId });
  }
}
