import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsTabPage } from './products-tab.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsTabPageRoutingModule {}
