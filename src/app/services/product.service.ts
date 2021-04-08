import { Injectable } from '@angular/core';
import { v4 } from 'uuid';
import { Product } from '../models/product';
import { ProductOverview } from '../models/product-overview';
import { SqlUtils } from '../utils/sql-utils';
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
    await this.dbSrv.insertFor({ ...product, id, lastTimeUpdated: SqlUtils.now() }, 'product');
    await this.insertIntoFts(id);
    return id;
  }
  
  async updateProduct(product: Product): Promise<string> {
    await this.deleteFromFts(product.id);
    await this.dbSrv.updateFor({ ...product, lastTimeUpdated: SqlUtils.now() }, 'product');
    await this.insertIntoFts(product.id);
    return product.id;
  }
  
  async deactivateProduct(productId: string): Promise<void> {
    await this.dbSrv.executeQuery('update product set deleted = 1 where id = ?', [productId]);
    await this.deleteFromFts(productId);
  }
  
  async reactivateProduct(productId) {
    await this.dbSrv.executeQuery('update product set deleted = 0 where id = ?', [productId]);
    await this.insertIntoFts(productId);
  }

  async getProducts(limit: number, offset: number) {
    return this.dbSrv.listQuery<ProductOverview>('select p.*, c.name as category from product p left join category c on p.category_id = c.id where p.deleted = 0 order by upper(p."name") limit ? offset ?', [limit, offset]);
  }
  
  async findProducts(filter: string, limit: number, offset: number) {
    const tokens = SqlUtils.buildTokens(filter);
    if (tokens === '\'\'') {
      return this.dbSrv.listQuery<ProductOverview>('select p.*, c.name as category from product p left join category c on p.category_id = c.id where p.deleted = 0 order by upper(p."name") limit ? offset ?', [limit, offset]);
    } else {
      return this.dbSrv.listQuery<ProductOverview>('select p.*, c.name as category from product_fts fts inner join product p on fts.id = p.id '
        + 'left join category c on p.category_id = c.id where product_fts match ' + tokens + ' order by rank limit ? offset ?', [limit, offset]);
    }
  }

  async findById(productId: string) {
    return this.dbSrv.objectQuery<Product>('select * from product where id = ?', [productId]);
  }

  private async insertIntoFts(productId: string) {
    await this.dbSrv.executeQuery('insert into product_fts(rowid, id, "name", package_type, content_quantity) select rowid, id, "name", package_type, content_quantity from product where id = ?', [productId]);
  }

  private async deleteFromFts(productId: string) {
    await this.dbSrv.executeQuery('insert into product_fts(product_fts, rowid, id, "name", package_type, content_quantity) select \'delete\', rowid, id, "name", package_type, content_quantity from product where id = ?', [productId]);
  }
}
