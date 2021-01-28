import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { ToastController } from "@ionic/angular";;

@Injectable()
export class GlobarErrorHandler implements ErrorHandler {

  constructor(private toastCtrl: ToastController, private zone: NgZone) {}

  async handleError(error: Error): Promise<void> {
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Ocurrió un error', color: 'danger', buttons: [{ text: 'Cerrar' }] });
    this.zone.run(() => toast.present());
  }

}