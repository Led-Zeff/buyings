import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { v4 } from 'uuid';
import { Buying } from '../models/buying';
import { BuyingDate } from '../models/buying-date';
import { BuyingOverview } from '../models/buying-overview';
import { Prices } from '../models/prices';
import { SqlUtils } from '../utils/sql-utils';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class BuyingService {

  constructor(private dbSrv: DatabaseService) { }

  async findById(buyingId: string) {
    return this.dbSrv.objectQuery<Buying>('select * from buying where id = ?', [buyingId]);
  }

  async findAllById(buyingIds: string[]) {
    const ids = buyingIds.map(b => `'${b}'`).join(',');
    return this.dbSrv.listQuery<Buying>(`select * from buying where id in (${ids})`);
  }

  async findPendingBuyings(filter: string) {
    const tokens = SqlUtils.buildTokens(filter);

    if (tokens === '\'\'') {
      return this.dbSrv.listQuery<BuyingOverview>('select b.id buyingId, p.id productId, p.name, p.icon, p.package_type, p.content_quantity, b.quantity, b.last_time_updated, b.is_bought, b.price '
            + 'from buying b inner join product p on b.product_id = p.id where b.is_bought = 0 order by p.last_bought_time');
    } else {
      return this.dbSrv.listQuery<BuyingOverview>('select b.id buyingId, p.id productId, p.name, p.icon, p.package_type, p.content_quantity, b.quantity, b.last_time_updated, b.is_bought, b.price '
            + 'from buying b inner join product p on b.product_id = p.id '
            + 'inner join product_fts fts on fts.id = p.id '
            + 'where product_fts match ' + tokens + ' order by rank');
    }
  }

  async getBuyingsByDate(boughtDate: string) {
    return this.dbSrv.listQuery<BuyingOverview>('select b.id buyingId, p.id productId, p.name, p.icon, p.package_type, p.content_quantity, b.quantity, b.last_time_updated, b.is_bought, b.price '
            + 'from buying b inner join product p on b.product_id = p.id where b.is_bought = 1 and date(b.bought_time) = ? order by p.last_bought_time', [boughtDate]);
  }

  async insert(buying: Buying) {
    const id = v4();
    await this.dbSrv.insertFor({...buying, id, lastTimeUpdated: SqlUtils.now()}, 'buying');
    if (buying.isBought === 1) this.updateProductPrice(buying.productId, buying.unitSalePrice);
    return id;
  }

  async update(buying: Buying) {
    await this.dbSrv.updateFor({...buying, lastTimeUpdated: SqlUtils.now()}, 'buying');
    if (buying.isBought === 1) this.updateProductPrice(buying.productId, buying.unitSalePrice);
    return buying.id;
  }

  async updateProductPrice(productId: string, price: number) {
    await this.dbSrv.executeQuery('update product set sale_price = ?, last_bought_time = ?, last_time_updated = ? where id = ?', [price, SqlUtils.now(), SqlUtils.now(), productId]);
  }

  async delete(buyingId: string) {
    await this.dbSrv.executeQuery('delete from buying where id = ?', [buyingId]);
  }

  async getLastPriceForProduct(productId: string) {
    return this.dbSrv.objectQuery<Prices>('select unit_price, unit_sale_price from buying where product_id = ? and is_bought = 1 order by bought_time desc limit 1', [productId]);
  }

  async getBuyingDates() {
    return this.dbSrv.listQuery<BuyingDate>('select date(bought_time) bought_date, sum(price) total from buying where is_bought = 1 group by date(bought_time) order by date(bought_time) desc');
  }

  async deleteAll(buyingIds: string[]) {
    const ids = buyingIds.map(b => `'${b}'`).join(',');
    await this.dbSrv.executeQuery(`delete from buying where id in (${ids})`); 
  }

  async getTotalToBuy() {
    return this.dbSrv.objectQuery<number>('select sum(price) from buying where is_bought = 0');
  }

}
