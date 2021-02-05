import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ResultSet } from '../models/result-set';
import { Mappers } from '../utils/mappers';
import { SqlUtils } from '../utils/sql-utils';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(platform: Platform, private sqlitePorter: SQLitePorter, sqlite: SQLite, private http: HttpClient) {
    platform.ready().then(() => {
      sqlite.create({
        name: 'buyings.db',
        location: 'default'
      })
      .then(db => {
        this.database = db;
        this.createDatabase();
      })
    });
  }

  async executeQuery(query: string, params?: any[]) {
    await this.onDbReady;
    return (await this.database.executeSql(query, params)) as ResultSet;
  }

  async singleColumnListQuery<T>(query: string, params?: any[]) {
    await this.onDbReady;
    const result = await this.database.executeSql(query, params);
    return Mappers.singleColumnMapper<T>(result);
  }

  async listQuery<T>(query: string, params?: any[]) {
    await this.onDbReady;
    const result = await this.database.executeSql(query, params);
    return Mappers.objectMapper<T>(result);
  }

  async objectQuery<T>(query: string, params?: any[]) {
    await this.onDbReady;
    const result = await this.database.executeSql(query, params);
    return Mappers.singleRowObjectMapper<T>(result);
  }

  async insertFor<T>(entity: T, tableName: string) {
    const {query, params} = SqlUtils.generateInsert<T>(entity, tableName);
    return this.executeQuery(query, params);
  }

  async updateFor<T>(entity: T, tableName: string, idColumn = 'id') {
    const {query, params} = SqlUtils.generateUpdate<T>(entity, tableName, idColumn);
    return this.executeQuery(query, params);
  }

  private createDatabase() {
    this.http.get('assets/database.sql', { responseType: 'text' }).subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql).then(() =>
        this.dbReady.next(true)
      );
    });
  }

  private get onDbReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.dbReady.getValue()) {
        resolve();
      } else {
        this.dbReady.pipe(
          filter(isReady => isReady)
        ).subscribe(
          () => resolve(),
          e => {
            console.log(e);
            reject(e);
          }
        )
      }
    });
  }
}
