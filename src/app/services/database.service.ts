import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { ResultSet } from '../models/result-set';
import { Mappers } from '../utils/mappers';
import { SqlUtils } from '../utils/sql-utils';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(platform: Platform,
    private sqlitePorter: SQLitePorter,
    sqlite: SQLite,
    private http: HttpClient,
    private fileSrv: FileService,
    private toastCtrl: ToastController
  ) {
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

  async exportDatabase(): Promise<string> {
    const db = await this.sqlitePorter.exportDbToSql(this.database);
    const prepared = this.prepareScript(db);
    const dbFile = await this.fileSrv.createFile(prepared);
    const externalFile = await this.fileSrv.sendFileToExternalDrive(dbFile);
    this.fileSrv.deleteFile(dbFile);
    return externalFile;
  }

  async importDatabase() {
    const path = await this.fileSrv.pickFile();
    const script = await this.fileSrv.readFile(path);
    await this.sqlitePorter.importSqlToDb(this.database, script);
  }

  private prepareScript(dbScript: string) {
    const toRemoveReferences = ['`\'product_fts_data\'`', '\'product_fts_data\'', '`\'product_fts_idx\'`', '\'product_fts_idx\'',
                                '`\'product_fts_docsize\'`', '\'product_fts_docsize\'', '`\'product_fts_config\'`', '\'product_fts_config\'',
                                'INSERT OR REPLACE INTO `product_fts`', '`product_fts_data`', '`product_fts_idx`', '`product_fts_docsize`',
                                '`product_fts_config`'];
    const sanitized = dbScript.split('\n').filter(script => script && !toRemoveReferences.some(r => script.includes(r)));
    return ['DROP TABLE IF EXISTS product_fts;', ...sanitized, 'INSERT INTO product_fts(product_fts) VALUES (\'rebuild\');', ''].join('\n');
  }

  private createDatabase() {
    this.http.get('assets/database.sql', { responseType: 'text' }).subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql).then(async () => {
        this.dbReady.next(true);
      });
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
