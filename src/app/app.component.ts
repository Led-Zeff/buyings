import { Component } from '@angular/core';
import { LoadingController, MenuController, NavController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { DatabaseService } from './services/database.service';
import { FileService } from './services/file.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private databaseSrv: DatabaseService,
    private toastCtrl: ToastController,
    private fileSrv: FileService,
    private loadingCtrl: LoadingController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.show();
      this.splashScreen.hide();
    });
  }

  goTo(path: string) {
    this.navCtrl.navigateForward(path);
    this.menuCtrl.close();
  }

  async exportHandler() {
    this.menuCtrl.close();
    await this.showLoading('Exportando ...');

    try {
      const createdFilePath = await this.databaseSrv.exportDatabase();
      const toast = await this.toastCtrl.create({
        message: 'Archivo creado',
        duration: 20000,
        buttons: [{
          side: 'start',
          icon: 'close'
        }, {
          side: 'end',
          text: 'Compartir',
          handler: () => this.fileSrv.shareFile('Database file', createdFilePath)
        }]
      });
      
      await toast.present();
    } catch (e) {
      throw e;
    } finally {
      this.loadingCtrl.dismiss();
    }
  }

  async importHandler() {
    this.menuCtrl.close();
    await this.showLoading('Importando ...');

    try {
      await this.databaseSrv.importDatabase();
      const toast = await this.toastCtrl.create({
        message: 'Base de datos importada correctamente',
        duration: 5000,
        buttons: [{ icon: 'close', side: 'start' }]
      });
  
      toast.present();
    } catch (error) {
      throw error;
    } finally {
      this.loadingCtrl.dismiss();
    }
  }

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message,
      spinner: 'circles'
    })
    loading.present();
  }
}
