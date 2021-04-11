import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
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
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./pages/category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'packages',
    loadChildren: () => import('./pages/packages/packages.module').then( m => m.PackagesPageModule)
  },
  {
    path: 'branches',
    loadChildren: () => import('./pages/branches/branches.module').then( m => m.BranchesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
