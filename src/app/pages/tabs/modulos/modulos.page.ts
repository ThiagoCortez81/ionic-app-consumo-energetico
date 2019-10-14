import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../../app.component";
import {WebservicesService} from "../../../services/webservices/webservices.service";
import {AlertService} from "../../../services/alert/alert.service";
import {Router} from "@angular/router";
import {tap} from "rxjs/operators";
import {FcmService} from "../../../services/fcm/fcm.service";
import {Platform, ToastController} from "@ionic/angular";
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
    selector: 'tab-modulos',
    templateUrl: 'modulos.page.html',
    styleUrls: ['modulos.page.scss']
})
export class ModulosPage implements OnInit {

    appName = AppComponent.appName;
    selectedSensor: any;
    listSensores: any;

    constructor(private _ws: WebservicesService, private _alertService: AlertService, private _nav: Router, private _fcm: FcmService,
                _toastCtrl: ToastController, private _platform: Platform, private _localNotifications: LocalNotifications) {
        this._platform.ready().then(() => {
            // Get an FCM token
            _fcm.getToken();

            // Listen to incoming messages
            _fcm.listenToNotifications().pipe(
                tap(msg => {
                    _localNotifications.schedule({
                        id: 1,
                        title: msg.title,
                        text: msg.body
                    })
                })
            ).subscribe();
        });
    }

    async ngOnInit(): Promise<any> {
        const loading = await this._alertService.defaultLoading("Carregando...");

        this._ws.listarSensoresCliente().then(resp => resp.toPromise()).then((resposta: any) => {
            if (resposta.isAuthenticated)
                this.listSensores = resposta.sensores;
            else
                alert("Deslogado");

            loading.dismiss();
        });
    }

    abrirAlertEditApelido(sensor) {
        this.selectedSensor = sensor;

        const title = 'Editar apelido do módulo';
        const inputs = [{
            name: 'apelido',
            type: 'text',
            placeholder: 'Apelido',
            value: this.selectedSensor.apelido
        }];
        const buttons = [{
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
                console.log('Confirm Cancel');
            }
        }, {
            text: 'Alterar',
            handler: (content) => {
                this.salvarNovoApelido(content.apelido);
            }
        }];
        this._alertService.promptAlert(title, inputs, buttons);
    }

    abrirAlertEditLimite(sensor) {
        this.selectedSensor = sensor;

        const title = 'Editar limite para alerta do módulo (em Kw/h)';
        const inputs = [{
            name: 'limiteAlerta',
            type: 'number',
            placeholder: 'Limite',
            value: this.selectedSensor.limiteAlerta
        }];
        const buttons = [{
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
                console.log('Confirm Cancel');
            }
        }, {
            text: 'Alterar',
            handler: (content) => {
                this.salvarNovoLimite(content.limiteAlerta);
            }
        }];
        this._alertService.promptAlert(title, inputs, buttons);
    }

    salvarNovoApelido(apelido: string) {
        this.selectedSensor.apelido = apelido;
        this._ws.alterarSensorApelido({sensor: this.selectedSensor}).then(res => res.toPromise()).then((response: any) => {
            if (response.isAuthenticated) {
                let header = "Oops!";
                let message = "Ops, ocorreu um problema ao salvar os dados. Tente novamente mais tarde!";
                let button = "Tentar novamente";
                if (response.success) {
                    header = "Sucesso!";
                    message = `Apelido '${apelido}' salvo com sucesso!`;
                    button = "Ok";
                }

                this._alertService.defaultAlert(header, null, message, [button]);
            } else {
                this._alertService.defaultAlert("Oops!", null, "Sua sessão expirou, faça o login novamente!", ["Vamos lá!"]);
            }
        });
    }

    salvarNovoLimite(limite: string) {
        this.selectedSensor.limiteAlerta = limite;
        this._ws.alterarSensorLimite({sensor: this.selectedSensor}).then(res => res.toPromise()).then((response: any) => {
            if (response.isAuthenticated) {
                let header = "Oops!";
                let message = "Ops, ocorreu um problema ao salvar os dados. Tente novamente mais tarde!";
                let button = "Tentar novamente";
                if (response.success) {
                    header = "Sucesso!";
                    message = `Limite de '${limite}' Kw/h salvo com sucesso!`;
                    button = "Ok";
                }

                this._alertService.defaultAlert(header, null, message, [button]);
            } else {
                this._alertService.defaultAlert("Oops!", null, "Sua sessão expirou, faça o login novamente!", ["Vamos lá!"]);
            }
        });
    }

    detalharSensor(sensor: any) {
        this._nav.navigate(["/modulo/", sensor.macSensor, sensor.apelido]);
    }

    converteData(data: string) {
        return this._alertService.converteData(data);
    }
}
