import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

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

  get dataDirectory() {
    return this.file.dataDirectory;
  }

  get cacheDirectory() {
    return this.file.cacheDirectory;
  }

  async createFile(directory: string, fileName: string, content: string): Promise<FileEntry> {
    const blob = new Blob([content]);
    return await this.file.writeFile(directory, fileName, blob, { append: false, replace: true });
  }

  async deleteFile(fileEntry: FileEntry) {
    this.file.removeFile(this.getFileDir(fileEntry.nativeURL), fileEntry.name);
  }
  
  async pickFile() {
    const path = await this.fileChooser.open();
    return await this.filePath.resolveNativePath(path);
  }
  
  async sendFileToExternalDrive(fileEntry: FileEntry): Promise<string> {
    // I wasn't able to crete it directly in the extarnal storage
    await this.checkPermission('READ_EXTERNAL_STORAGE');
    const newFile = `${this.file.externalRootDirectory}/Download/${fileEntry.name}`;
    await this.fileTransferObj.download(fileEntry.nativeURL, newFile);
    return newFile;
  }

  async shareFile(message: string, filePath: string) {
    await this.socialSharing.share(message, null, filePath);
  }

  async readFile(nativePath: string): Promise<string> {
    await this.checkPermission('READ_EXTERNAL_STORAGE');
    return new Promise(async (resolve, reject) => {
      try {
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
      } catch (error) {
        reject(error);
      }
    });
  }

  resoluveNativePath(path: string) {
    return this.filePath.resolveNativePath(path);
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
