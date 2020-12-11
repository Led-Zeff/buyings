import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyingsTabPageRoutingModule } from './buyings-tab-routing.module';

import { BuyingsTabPage } from './buyings-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyingsTabPageRoutingModule
  ],
  declarations: [BuyingsTabPage]
})
export class BuyingsTabPageModule {}
