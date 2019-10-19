import {Injectable} from '@angular/core';
import {Platform} from "@ionic/angular";
import {FirebaseX} from "@ionic-native/firebase-x/ngx";
import {HttpClient} from "@angular/common/http";
import {WebservicesService} from "../webservices/webservices.service";

@Injectable({
    providedIn: 'root'
})
export class FcmService {

    // _URL_WEBSERVICES = "http://cortezit.me/api/";
    _URL_WEBSERVICES = "http://192.168.0.5:3000/api/";
    // _URL_WEBSERVICES = "http://localhost:3000/api/";

    constructor(private platform: Platform,
                public firebaseNative: FirebaseX,
                private _ws: WebservicesService) {
        console.log('Hello FcmProvider Provider');
    }

    // Get permission from the user
    async getToken() {
        let token;
        console.info('this.platform-> ', this.platform);
        if (this.platform.is('android')) {
            token = await this.firebaseNative.getToken();
        }

        console.log('token', token);
        const sendObj = {
            token: token
        };
        this._ws.storeToken(sendObj).then(resp => resp.toPromise()).then((res) => {
            console.log(res);
        });
    }

    // Listen to incoming FCM messages
    listenToNotifications() {
        return this.firebaseNative.onMessageReceived();
        // return this.firebaseNative.onNotificationOpen()
    }
}
