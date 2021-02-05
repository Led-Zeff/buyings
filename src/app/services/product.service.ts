import { Injectable } from '@angular/core';
import { v4 } from 'uuid';
import { Product } from '../models/product';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private dbSrv: DatabaseService) { }

  async getPackages() {
    return this.dbSrv.singleColumnListQuery<string>('select * from packaging');
  }

  async newPackage(name: string): Promise<string> {
    const normName = name.trim().toLocaleUpperCase();
    await this.dbSrv.executeQuery('insert into packaging values (?)', [normName]);
    return normName;
  }

  async newProduct(product: Product): Promise<string> {
    const id = v4();
    await this.dbSrv.executeQuery('insert into product(id, "name", package_type, content_quantity, sale_price, icon) values (?,?,?,?,?,?)',
      [id, product.name, product.packageType, product.contentQuantity, product.salePrice, product.icon]);
    return id;
  }
  
  async updateProduct(product: Product): Promise<string> {
    await this.dbSrv.executeQuery('update product set "name" = ?, package_type = ?, content_quantity = ?, sale_price = ?, last_time_updated = datetime(\'now\'), icon = ? where id = ?',
      [product.name, product.packageType, product.contentQuantity, product.salePrice, product.icon, product.id]);
    return product.id;
  }
  
  async deleteProduct(productId: string): Promise<void> {
    await this.dbSrv.executeQuery('delete from product where id = ?', [productId]);
  }

  async getProducts(limit: number, offset: number) {
    return this.dbSrv.listQuery<Product>('select * from product where deleted = 0 order by "name" limit ? offset ?', [limit, offset]);
  }
  
  async findProducts(filter: string, limit: number, offset: number) {
    return this.dbSrv.listQuery<Product>('select * from product where deleted = 0 and "name" like \'%\' || ? || \'%\' order by "name" limit ? offset ?', [filter, limit, offset]);
  }

  async findById(productId: string) {
    return this.dbSrv.objectQuery<Product>('select * from product where id = ?', [productId]);
  }
}
