import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsTabPageRoutingModule } from './products-tab-routing.module';

import { ProductsTabPage } from './products-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsTabPageRoutingModule
  ],
  declarations: [ProductsTabPage]
})
export class ProductsTabPageModule {}
