import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'buyings',
        loadChildren: () => import('../buyings-tab/buyings-tab.module').then(m => m.BuyingsTabPageModule)
      },
      {
        path: 'products',
        loadChildren: () => import('../products-tab/products-tab.module').then(m => m.ProductsTabPageModule)
      },
      {
        path: '',
        redirectTo: 'buyings',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
