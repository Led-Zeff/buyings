import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductPageRoutingModule } from './product-routing.module';
import { ProductPage } from './product.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    ProductPageRoutingModule
  ],
  declarations: [ProductPage]
})
export class ProductPageModule {}
