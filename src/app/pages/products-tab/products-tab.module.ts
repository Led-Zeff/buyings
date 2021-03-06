import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductsTabPageRoutingModule } from './products-tab-routing.module';
import { ProductsTabPage } from './products-tab.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    ProductsTabPageRoutingModule
  ],
  declarations: [ProductsTabPage]
})
export class ProductsTabPageModule {}
