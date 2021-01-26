import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private dbSrv: DatabaseService, private http: HttpClient) { }

  async getPackages() {
    return this.dbSrv.singleRowListQuery<string>('select * from packaging');
  }

  async newPackage(name: string) {
    return this.dbSrv.executeQuery('insert into packaging values (?)', [name]);
  }

}
