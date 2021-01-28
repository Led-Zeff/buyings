import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 } from 'uuid';
import { Product } from '../models/product';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private dbSrv: DatabaseService, private http: HttpClient) { }

  async getPackages() {
    return this.dbSrv.singleRowListQuery<string>('select * from packaging');
  }

  async newPackage(name: string): Promise<string> {
    const normName = name.trim().toLocaleUpperCase();
    await this.dbSrv.executeQuery('insert into packaging values (?)', [normName]);
    return normName;
  }

  async newProduct(product: Product): Promise<string> {
    const id = v4();
    await this.dbSrv.executeQuery('insert into product(id, "name", package_type, content_quantity, sale_price) values (?,?,?,?,?)',
      [id, product.name, product.packageType, product.contentQuantity, product.salePrice]);
    return id;
  }

}
