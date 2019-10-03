import {Injectable} from '@angular/core';
import {AlertController, LoadingController, ToastController} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private _alertController: AlertController, private _toastController: ToastController, private _loadingController: LoadingController) {
    }

    async defaultAlert(header: string | null, subHeader: string | null, message: string | null, buttons: string[] | null) {
        const alert = await this._alertController.create({
            header: header,
            subHeader: subHeader,
            message: message,
            buttons: buttons
        });
        await alert.present();
    }

    async promptAlert(title, inputs, buttons) {
        const alert = await this._alertController.create({
            header: title,
            inputs: inputs,
            buttons: buttons
        });

        await alert.present();
    }

    async defaultToast(message: string) {
        const toast = await this._toastController.create({
            message: message,
            duration: 2000
        });

        toast.present();
    }

    async defaultLoading(message: string) {
        const loading = await this._loadingController.create({
            message: message
        });
        await loading.present();

        return loading;
    }
}