import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { icons, randomIcon } from 'src/app/utils/product-icons';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  @Input() product: Product;

  productForm: FormGroup;
  packages: string[];
  icons = {'PIEZA': 'pricetag-outline', 'LITRO': 'water-outline', 'KILO': 'cube-outline'};

  constructor(private modalCtrl: ModalController,
    private productSrv: ProductService,
    private fb: FormBuilder,
    private alertCtrl: AlertController) { }

  async ngOnInit() {
    this.productForm = this.fb.group({
      id: [],
      name: ['', [CustomValidators.notEmpty, CustomValidators.noSymbols] ],
      packageType: [],
      contentQuantity: [null, [Validators.required, Validators.min(1), CustomValidators.number] ],
      lastBoughtTime: [],
      salePrice: [null, [CustomValidators.decimal] ],
      lastTimeUpdated: [],
      deleted: []
    });

    await this.loadPackages();
    if (this.product) {
      this.productForm.patchValue(this.product);
    }
  }

  async loadPackages() {
    this.packages = await this.productSrv.getPackages();
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
      const prod: Product = {...this.productForm.value, icon: icons[this.productForm.value.packageType] || randomIcon()};
      if (!this.product?.id) {
        id = await this.productSrv.newProduct(prod);
      } else {
        id = await this.productSrv.updateProduct(prod);
      }
      this.dismissModal(id);
    }
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      subHeader: `Eliminar producto ${this.productForm.value.name}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.deleteProduct();
          }
        }
      ]
    });

    await alert.present();
  }

  private async deleteProduct() {
    if (this.product?.id) {
      await this.productSrv.deleteProduct(this.product.id);
      this.dismissModal('deleted');
    }
  }

  private async createPackage(name: string) {
    if (name && name.trim() !== '') {
      const pack = await this.productSrv.newPackage(name);
      await this.loadPackages();
      this.productForm.controls.packageType.setValue(pack);
    }
  }

  dismissModal(productId?: string) {
    this.modalCtrl.dismiss({ productId });
  }
}
