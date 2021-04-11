import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private dbSrv: DatabaseService) { }

  getPackages() {
    return this.dbSrv.singleColumnListQuery<string>('select * from packaging order by package_type');
  }

  async newPackage(name: string): Promise<string> {
    const normName = name.trim().toLocaleUpperCase();
    await this.dbSrv.executeQuery('insert into packaging values (?)', [normName]);
    return normName;
  }

  delete(name: string) {
    return this.dbSrv.executeQuery('delete from packaging where package_type = ?', [name]);
  }
}
