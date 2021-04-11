import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private dbSrv: DatabaseService) { }

  getBranches() {
    return this.dbSrv.singleColumnListQuery<string>('select * from branch order by name');
  }

  async create(name: string): Promise<string> {
    const normName = name.trim().toLocaleUpperCase();
    await this.dbSrv.executeQuery('insert into branch values (?)', [normName]);
    return normName;
  }

  delete(name: string) {
    return this.dbSrv.executeQuery('delete from branch where name = ?', [name]);
  }
}
