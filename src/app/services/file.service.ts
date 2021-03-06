import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  fileTransferObj: FileTransferObject;

  constructor(private file: File,
    private fileChooser: FileChooser,
    private socialSharing: SocialSharing,
    private androidPermissions: AndroidPermissions,
    fileTransfer: FileTransfer,
    private filePath: FilePath,
  ) {
    this.fileTransferObj = fileTransfer.create();
  }

  async createFile(content: string): Promise<FileEntry> {
    const blob = new Blob([content], { type: 'text/sql' });
    const now = moment().format('D MMM yyyy HHmmss');
    const filename = `Database ${now}.sql`;
    return await this.file.writeFile(this.file.cacheDirectory, filename, blob, { append: false, replace: true });
  }

  async deleteFile(fileEntry: FileEntry) {
    this.file.removeFile(this.getFileDir(fileEntry.nativeURL), fileEntry.name);
  }
  
  async pickFile() {
    const path = await this.fileChooser.open();
    return await this.filePath.resolveNativePath(path);
  }
  
  async sendFileToExternalDrive(fileEntry: FileEntry): Promise<string> {
    // I wasm't able to crete it directly in the extarnal storage
    await this.checkPermission('READ_EXTERNAL_STORAGE');
    const newFile = `${this.file.externalRootDirectory}/Download/${fileEntry.name}`;
    await this.fileTransferObj.download(fileEntry.nativeURL, newFile);
    return newFile;
  }

  async shareFile(message: string, filePath: string) {
    await this.socialSharing.share(message, null, filePath);
  }

  async readFile(nativePath: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const fileEntry = await this.file.resolveLocalFilesystemUrl(nativePath) as FileEntry;
      fileEntry.file(f => {
        const reader = new FileReader() as any; // for some reason reader is not working as expected
        reader.readAsText(f);
        
        const checker = () => {
          if (reader._readyState === 2) {
            resolve(reader._result);
          } else {
            setTimeout(() => checker(), 250); // wait to check again
          }
        };
        checker();
      });
    });
  }

  private async checkPermission(permission: any) {
    const response = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION[permission]);
    if (!response.hasPermission) {
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION[permission]);
    }
  }

  private getFileDir(filePath: string) {
    const lastIndx = filePath.lastIndexOf('/');
    return filePath.substring(0, lastIndx + 1);
  }

  private getFileName(filePath: string) {
    const lastIndx = filePath.lastIndexOf('/');
    return filePath.substring(lastIndx + 1);
  }

}
