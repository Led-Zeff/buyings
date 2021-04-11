import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ToastController } from '@ionic/angular';
import { BranchService } from 'src/app/services/branch.service';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.page.html',
  styleUrls: ['./branches.page.scss'],
})
export class BranchesPage implements OnInit {
  @ViewChild(IonList) categoriesList: IonList;

  branches: string[];
  showFab = true;
  
  constructor(private alertCtrl: AlertController,
    private branchSrv: BranchService,
    private toastCtrl: ToastController) { }

  ngOnInit() {
    this.loadBranches();
  }

  async loadBranches() {
    this.branches = await this.branchSrv.getBranches();
  }

  onScroll(e: CustomEvent) {
    if (e.detail.velocityY < 0) { // scrolling up
      this.showFab = true;
    } else if (e.detail.velocityY > 0) { // scrolling down
      this.showFab = false;
    }
  }

  async newBranchDialog() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Nueva sucursal',
      inputs: [
        { 
          name: 'branch',
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
          handler: ({branch}) => {
            this.createBranch(branch);
          }
        }
      ]
    });

    await alert.present();
  }

  private async createBranch(name: string) {
    if (name && name.trim() !== '') {
      await this.branchSrv.create(name);
      await this.loadBranches();
    }
  }

  async deleteBranch(name: string) {
    this.categoriesList.closeSlidingItems();
    await this.branchSrv.delete(name);
    this.loadBranches();

    const toast = await this.toastCtrl.create({
      message: 'Sucursal eliminada',
      duration: 2000,
      buttons: [
        { side: 'start', icon: 'close' },
        { side: 'end', text: 'Deshacer', handler: () => this.undoDelete(name) }
      ]
    });
    toast.present();
  }

  async undoDelete(name: string) {
    this.createBranch(name);
  }
}
