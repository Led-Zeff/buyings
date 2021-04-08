import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

const MAX_PROFIT = 200;

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  @Input() category?: Category;

  categoryForm: FormGroup;
  maxProfit = MAX_PROFIT;

  constructor(private fb: FormBuilder,
    private categorySrv: CategoryService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      id: [],
      name: [null, Validators.required],
      profitPercentage: [0, Validators.required]
    });

    if (this.category) {
      this.categoryForm.patchValue(this.category);
      this.setMaxProfit();
    }
  }

  dismissModal(category?: Category) {
    this.modalCtrl.dismiss({ category });
  }

  async onSubmit() {
    if (this.categoryForm.valid) {
      if (!this.categoryForm.value.id) {
        const newCat = await this.categorySrv.insert(this.categoryForm.value);
        this.dismissModal(newCat);
      } else {
        this.categorySrv.update(this.categoryForm.value);
        this.dismissModal(this.categoryForm.value);
      }
    }
  }

  async showProfitDialog() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Porcentaje de ganancia',
      inputs: [
        { 
          name: 'profit',
          type: 'number',
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
          handler: ({profit}) => {
            this.categoryForm.controls.profitPercentage.setValue(profit);
            this.setMaxProfit();
          }
        }
      ]
    });

    await alert.present();
  }

  setMaxProfit() {
    if (this.categoryForm.controls.profitPercentage.value > MAX_PROFIT) {
      this.maxProfit = Math.round(this.categoryForm.controls.profitPercentage.value * 1.3);
    }
  }
}
