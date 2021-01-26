import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  productForm: FormGroup;
  packages: string[];

  constructor(private modalCtrl: ModalController, private productSrv: ProductService, private fb: FormBuilder, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      id: [],
      name: [],
      packageType: [],
      contentQuantity: [],
      lastBoughtTime: [],
      salePrice: [],
      deleted: []
    });

    this.loadPackages();
  }

  async loadPackages() {
    this.packages = await this.productSrv.getPackages();
  }

  async newPackage() {
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
            if (packaging && packaging.trim() !== '') {
              this.productSrv.newPackage(packaging);
              this.loadPackages();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
