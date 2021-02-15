import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable, merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Buying } from 'src/app/models/buying';
import { BuyingAction } from 'src/app/models/buying-action';
import { Prices } from 'src/app/models/prices';
import { Product } from 'src/app/models/product';
import { BuyingService } from 'src/app/services/buying.service';
import { ProductService } from 'src/app/services/product.service';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { SqlUtils } from 'src/app/utils/sql-utils';
import { SearchProductPage } from '../search-product/search-product.page';

@Component({
  selector: 'app-buying',
  templateUrl: './buying.page.html',
  styleUrls: ['./buying.page.scss'],
})
export class BuyingPage implements OnInit, OnDestroy {
  @Input() productId: string;
  @Input() action: BuyingAction;
  @Input() buyingId?: string;

  buyingForm: FormGroup;
  product: Product;
  unitPrice$: Observable<number>;
  proposedUnitSalePrice: number;
  productPrices: Prices;

  private _quantityValidators: ValidatorFn[] = [CustomValidators.number, Validators.min(1)];
  private _priceValidators: ValidatorFn[] = [CustomValidators.decimal];
  private _subscription = new Subscription();

  constructor(private buyingSrv: BuyingService,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private productSrv: ProductService) { }

  async ngOnInit() {
    this.buyingForm = this.fb.group({
      id: [''],
      productId: [this.productId],
      isBought: [false],
      boughtTime: [],
      quantity: [null, this._quantityValidators],
      price: [null, this._priceValidators],
      unitPrice: [null],
      unitSalePrice: [null, this._priceValidators],
      lastTimeUpdated: []
    });

    this.setUnitPrices();

    this.setValidations();

    this.product = await this.productSrv.findById(this.productId);
    if (this.buyingId) {
      const buying = await this.buyingSrv.findById(this.buyingId);
      this.buyingForm.patchValue({
        ...buying,
        isBought: buying.isBought === 1 || this.action === 'buy' ? true : false,
        salePrice: this.product.salePrice
      });
    }

    this.productPrices = await this.buyingSrv.getLastPriceForProduct(this.productId);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  setUnitPrices() {
    this.unitPrice$ = merge(
      this.buyingForm.controls.quantity.valueChanges,
      this.buyingForm.controls.price.valueChanges
    ).pipe(
      map(() => {
        if (!this.buyingForm.controls.price.value || !this.buyingForm.controls.quantity.value) {
          this.proposedUnitSalePrice = null;
          return 0;
        }

        const quantity = this.buyingForm.controls.quantity.value;
        const price = this.buyingForm.controls.price.value;
        const unitPrice = price / quantity / this.product.contentQuantity;
        this.buyingForm.controls.unitPrice.setValue(unitPrice);

        if (this.productPrices) { // set proposed sale price
          const previousMargin = this.productPrices.unitSalePrice * 100 / this.productPrices.unitPrice;
          this.proposedUnitSalePrice = Number((unitPrice / 100 * previousMargin).toFixed(2));
        }

        return unitPrice;
      })
    );
  }

  setValidations() {
    this._subscription.add(this.buyingForm.controls.isBought.valueChanges.subscribe(value => {
      if (this.action === 'buy' || value) {
        this.buyingForm.controls.quantity.setValidators([...this._quantityValidators, Validators.required]);
        this.buyingForm.controls.quantity.updateValueAndValidity();
        this.buyingForm.controls.price.setValidators([...this._priceValidators, Validators.required]);
        this.buyingForm.controls.price.updateValueAndValidity();
        this.buyingForm.controls.unitSalePrice.setValidators([...this._priceValidators, Validators.required]);
        this.buyingForm.controls.unitSalePrice.updateValueAndValidity();
      } else {
        this.buyingForm.controls.quantity.setValidators(this._quantityValidators);
        this.buyingForm.controls.quantity.updateValueAndValidity();
        this.buyingForm.controls.price.setValidators(this._priceValidators);
        this.buyingForm.controls.price.updateValueAndValidity();
        this.buyingForm.controls.unitSalePrice.setValidators(this._priceValidators);
        this.buyingForm.controls.unitSalePrice.updateValueAndValidity();
      }
    }));
  }

  async save() {
    this.buyingForm.markAllAsTouched();
    if (this.buyingForm.valid) {
      const buying: Buying = {
        ...this.buyingForm.value,
        isBought: this.buyingForm.value.isBought ? 1 : 0,
        boughtTime: this.buyingForm.value.isBought ? SqlUtils.now() : null
      };

      switch (this.action) {
        case 'add':
          const newId = await this.buyingSrv.insert(buying)
          this.dismissModal(newId);
          break;

        case 'edit':
        case 'buy':
          const id = await this.buyingSrv.update(buying)
          this.dismissModal(id);
          break;
      
        default:
          throw new Error('No implemented option');
      }
    }
  }

  dismissModal(buyingId?: string) {
    this.modalCtrl.dismiss({ buyingId });
  }

  async showSelectProductModal() {
    const modal = await this.modalCtrl.create({
      component: SearchProductPage
    });

    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data?.productId) {
      this.product = await this.productSrv.findById(data.productId);
    }
  }
}
