import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { BuyingPageRoutingModule } from './buying-routing.module';

import { BuyingPage } from './buying.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    BuyingPageRoutingModule
  ],
  declarations: [BuyingPage]
})
export class BuyingPageModule {}
