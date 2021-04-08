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
  private dbImported: BehaviorSubject<void> = new BehaviorSubject(null);

  constructor(platform: Platform,
    private sqlitePorter: SQLitePorter,
    sqlite: SQLite,
    private http: HttpClient,
    private fileSrv: FileService
  ) {
    platform.ready().then(() => {
      sqlite.create({
        name: 'buyings.db',
        location: 'default'
      })
      .then(db => {
        this.database = db;
        this.updateDatabase();
      })
    });
  }

  get onDbImported() {
    return this.dbImported.asObservable();
  }

  async executeQuery(query: string, params?: any[]): Promise<ResultSet> {
    await this.onDbReady;
    return (await this.database.executeSql(query, params)) as ResultSet;
  }

  async singleColumnListQuery<T>(query: string, params?: any[]): Promise<T[]> {
    await this.onDbReady;
    const result = await this.database.executeSql(query, params);
    return Mappers.singleColumnMapper<T>(result);
  }

  async listQuery<T>(query: string, params?: any[]): Promise<T[]> {
    await this.onDbReady;
    const result = await this.database.executeSql(query, params);
    return Mappers.objectMapper<T>(result);
  }

  async objectQuery<T>(query: string, params?: any[]): Promise<T> {
    await this.onDbReady;
    const result = await this.database.executeSql(query, params);
    return Mappers.singleRowObjectMapper<T>(result);
  }

  async insertFor<T>(entity: T, tableName: string, generatedIdField?: string): Promise<ResultSet> {
    await this.onDbReady;
    const {query, params} = SqlUtils.generateInsert<T>(entity, tableName, generatedIdField);
    return this.executeQuery(query, params);
  }

  async updateFor<T>(entity: T, tableName: string, idColumn = 'id'): Promise<ResultSet> {
    await this.onDbReady;
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

  async importDatabase(): Promise<void> {
    const path = await this.fileSrv.pickFile();
    const script = await this.fileSrv.readFile(path);
    await this.sqlitePorter.importSqlToDb(this.database, script);
    await this.updateDatabase();
    this.dbImported.next();
  }

  private prepareScript(dbScript: string) {
    const toRemoveReferences = ['`\'product_fts_data\'`', '\'product_fts_data\'', '`\'product_fts_idx\'`', '\'product_fts_idx\'',
                                '`\'product_fts_docsize\'`', '\'product_fts_docsize\'', '`\'product_fts_config\'`', '\'product_fts_config\'',
                                'INSERT OR REPLACE INTO `product_fts`', '`product_fts_data`', '`product_fts_idx`', '`product_fts_docsize`',
                                '`product_fts_config`'];
    const sanitized = dbScript.split('\n').filter(script => script && !toRemoveReferences.some(r => script.includes(r)));
    return ['DROP TABLE IF EXISTS product_fts;', ...sanitized, 'INSERT INTO product_fts(product_fts) VALUES (\'rebuild\');', ''].join('\n');
  }

  private async updateDatabase() {
    let dbVersion = await this.getDbVersion();
    const currentVersion = 2;

    while (dbVersion < currentVersion) {
      await this.importSql(`database.${++dbVersion}.sql`);
    }
    this.dbReady.next(true);
  }

  private async getDbVersion() {
    try {
      const dbVersion = await this.database.executeSql('select "value" from settings where id = ?', ['db.version']);
      return Mappers.singleRowObjectMapper<number>(dbVersion) ?? 0;
    } catch (e) {
      console.error(e);
      return 0;
    }
  }

  private async importSql(fileName: string) {
    return new Promise<void>((resolve, reject) => {
      this.http.get(`assets/${fileName}`, { responseType: 'text' }).subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql).then(async () => {
          resolve();
        })
        .catch(reject);
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
