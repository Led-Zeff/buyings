import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private platform: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
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

  private createDatabase() {
    this.http.get('assets/database-scheme.sql', { responseType: 'text' }).subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql).then(() =>
        this.dbReady.next(true)
      );
    });
  }

  async executeQuery(query: string, params?: any[]) {
    await this.onDbReady;

    console.log(await this.database.executeSql(query, params));
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
