import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FileService } from './file.service';

export interface AppSettings {
  lastSelectedBrach?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private fileName = 'app.settings.json';
  private fileDir: string;
  private settingsSubject = new BehaviorSubject<AppSettings>(null);

  constructor(private fileSrv: FileService) {
    this.fileDir = fileSrv.dataDirectory;
    this.loadSettings();
  }

  getSettings() {
    return new Promise<AppSettings>((resolve, reject) => {
      if (this.settingsSubject.getValue() !== null) {
        resolve(this.settingsSubject.getValue());
      } else {
        this.settingsSubject.pipe(filter(s => s !== null)).subscribe(resolve, reject);
      }
    });
  }

  updateSettings(settings: Partial<AppSettings>) {
    this.settingsSubject.next({...this.settingsSubject.getValue(), ...settings});
    const json = JSON.stringify(this.settingsSubject.getValue());
    this.fileSrv.createFile(this.fileDir, this.fileName, json);
  }
  
  private async loadSettings() {
    try {
      const path = `${this.fileDir}/${this.fileName}`;
      const json = await this.fileSrv.readFile(path);
      this.settingsSubject.next(JSON.parse(json));
    } catch (error) {
      console.error(error);
      this.settingsSubject.next({});
    }
  }
}
