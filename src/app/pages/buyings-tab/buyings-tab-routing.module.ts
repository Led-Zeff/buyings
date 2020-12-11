import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyingsTabPage } from './buyings-tab.page';

const routes: Routes = [
  {
    path: '',
    component: BuyingsTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyingsTabPageRoutingModule {}
