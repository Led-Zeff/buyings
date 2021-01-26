import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { BuyingsTabPageRoutingModule } from './buyings-tab-routing.module';

import { BuyingsTabPage } from './buyings-tab.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    BuyingsTabPageRoutingModule
  ],
  declarations: [BuyingsTabPage]
})
export class BuyingsTabPageModule {}
