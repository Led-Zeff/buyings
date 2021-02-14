import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'buying',
    loadChildren: () => import('./pages/buying/buying.module').then( m => m.BuyingPageModule)
  },
  {
    path: 'search-product',
    loadChildren: () => import('./pages/search-product/search-product.module').then( m => m.SearchProductPageModule)
  },
  {
    path: 'import-database',
    loadChildren: () => import('./pages/import-database/import-database.module').then( m => m.ImportDatabasePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
