import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ToastController } from '@ionic/angular';
import { PackageService } from 'src/app/services/package.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage implements OnInit {
  @ViewChild(IonList) categoriesList: IonList;

  packages: string[];
  showFab = true;

  constructor(private alertCtrl: AlertController,
    private packageSrv: PackageService,
    private toastCtrl: ToastController) { }

  ngOnInit() {
    this.loadPackages();
  }

  onScroll(e: CustomEvent) {
    if (e.detail.velocityY < 0) { // scrolling up
      this.showFab = true;
    } else if (e.detail.velocityY > 0) { // scrolling down
      this.showFab = false;
    }
  }

  async loadPackages() {
    this.packages = await this.packageSrv.getPackages();
  }

  async newPackageDialog() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Nuevo tipo de empaquetado',
      inputs: [
        { 
          name: 'packaging',
          type: 'text',
          attributes: { required: true }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: ({packaging}) => {
            this.createPackage(packaging);
          }
        }
      ]
    });

    await alert.present();
  }

  private async createPackage(name: string) {
    if (name && name.trim() !== '') {
      await this.packageSrv.newPackage(name);
      await this.loadPackages();
    }
  }

  async deletePakage(name: string) {
    this.categoriesList.closeSlidingItems();
    await this.packageSrv.delete(name);
    this.loadPackages();

    const toast = await this.toastCtrl.create({
      message: 'Empaquetado eliminado',
      duration: 2000,
      buttons: [
        { side: 'start', icon: 'close' },
        { side: 'end', text: 'Deshacer', handler: () => this.undoDelete(name) }
      ]
    });
    toast.present();
  }

  async undoDelete(name: string) {
    this.createPackage(name);
  }
}
