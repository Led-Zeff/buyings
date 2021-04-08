import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private tableName = "category";

  constructor(private dbSrv: DatabaseService) { }

  getAll() {
    return this.dbSrv.listQuery<Category>('select * from category order by upper(name)');
  }

  async insert(category: Category): Promise<Category> {
    const result = await this.dbSrv.insertFor(category, this.tableName, !category.id ? 'id' : undefined);
    return {...category, id: category.id ?? result.insertId};
  }

  update(category: Category) {
    return this.dbSrv.updateFor(category, this.tableName);
  }

  async delete(categoryId: number) {
    await this.dbSrv.executeQuery('delete from category where id = ?', [categoryId]);
  }

  async getProductIdByCategory(category: number) {
    return await this.dbSrv.singleColumnListQuery<string>('select id from product where category_id = ?', [category]);
  }

  async updateProductsCategory(productIds: string[], categoryId: number) {
    const ids = productIds.map(id => `'${id}'`).join(',');
    await this.dbSrv.executeQuery(`update product set category = ? where id in (${ids})`, [categoryId]);
  }
}
