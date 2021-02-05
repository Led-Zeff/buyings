import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { v4 } from 'uuid';
import { Buying } from '../models/buying';
import { BuyingOverview } from '../models/buying-overview';
import { Prices } from '../models/prices';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class BuyingService {

  constructor(private dbSrv: DatabaseService) { }

  async findById(buyingId: string) {
    return this.dbSrv.objectQuery<Buying>('select * from buying where id = ?', [buyingId]);
  }

  async findBuyings(isBought: boolean, filter: string) {
    return this.dbSrv.listQuery<BuyingOverview>('select b.id buyingId, p.id productId, p.name, p.icon, p.package_type, p.content_quantity, b.quantity, b.last_time_updated, b.is_bought, b.price '
            + 'from buying b inner join product p on b.product_id = p.id '
            + 'where b.is_bought = ? and p.name like \'%\' || ? || \'%\'', [isBought ? 1 : 0, filter]);
  }

  async insert(buying: Buying) {
    const id = v4();
    await this.dbSrv.insertFor({...buying, id, lastTimeUpdated: moment()}, 'buying');
    return id;
  }

  async update(buying: Buying) {
    await this.dbSrv.updateFor({...buying, lastTimeUpdated: moment()}, 'buying');
    return buying.id;
  }

  async delete(buyingId: string) {
    await this.dbSrv.executeQuery('delete from buying where id = ?', [buyingId]);
  }

  async getLastPriceForProduct(productId: string) {
    return this.dbSrv.objectQuery<Prices>('select unit_price, unit_sale_price from buying where product_id = ? and is_bought = 1 order by bought_time desc limit 1', [productId]);
  }

}
