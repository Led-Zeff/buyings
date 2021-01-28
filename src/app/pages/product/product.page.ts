import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  productForm: FormGroup;
  packages: string[];

  constructor(private modalCtrl: ModalController,
    private productSrv: ProductService,
    private fb: FormBuilder,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      id: [],
      name: ['', [CustomValidators.notEmpty, CustomValidators.noSymbols] ],
      packageType: [],
      contentQuantity: [null, [Validators.required, Validators.min(1), CustomValidators.number] ],
      lastBoughtTime: [],
      salePrice: [null, [CustomValidators.decimal] ],
      deleted: []
    });

    this.loadPackages();
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
      await this.productSrv.newProduct(this.productForm.value);
      this.dismissModal();
    }
  }

  private async createPackage(name: string) {
    if (name && name.trim() !== '') {
      const pack = await this.productSrv.newPackage(name);
      await this.loadPackages();
      this.productForm.controls.packageType.setValue(pack);
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
