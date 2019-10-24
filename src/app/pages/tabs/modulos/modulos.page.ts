import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../../app.component";
import {WebservicesService} from "../../../services/webservices/webservices.service";
import {AlertService} from "../../../services/alert/alert.service";
import {Router} from "@angular/router";
import {tap} from "rxjs/operators";
import {FcmService} from "../../../services/fcm/fcm.service";
import {Platform, ToastController} from "@ionic/angular";
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {StorageService} from "../../../services/storage/storage.service";

@Component({
    selector: 'tab-modulos',
    templateUrl: 'modulos.page.html',
    styleUrls: ['modulos.page.scss']
})
export class ModulosPage implements OnInit {

    appName = AppComponent.appName;
    selectedSensor: any;
    listSensores: any;
    consumo: any;

    constructor(private _ws: WebservicesService, private _alertService: AlertService, private _nav: Router, private _fcm: FcmService,
                _toastCtrl: ToastController, private _platform: Platform, private _localNotifications: LocalNotifications, private _storageService: StorageService) {
    }

    async ngOnInit(): Promise<any> {
        await this.initializePage();
    }

    async initializePage() {
        this.consumo = await this._storageService.getValorKW();

        // Registrando o serviço do firebase
        this._platform.ready().then(() => {
            // Get an FCM token
            this._fcm.getToken();

            // Listen to incoming messages
            this._fcm.listenToNotifications().pipe(
                tap(msg => {
                    this._localNotifications.schedule({
                        id: 1,
                        title: msg.title,
                        text: msg.body
                    })
                })
            ).subscribe();
        });

        const loading = await this._alertService.defaultLoading("Carregando...");

        this._ws.listarSensoresCliente().then(resp => resp.toPromise()).then((resposta: any) => {
            if (resposta.isAuthenticated) {
                this.listSensores = resposta.sensores;
            } else {
                this._storageService.saveJWT(undefined).then((res) => {
                    this._alertService.defaultAlert("Oops!", null, "Sua sessão expirou, faça o login novamente!", ["Vamos lá!"]);
                    this._nav.navigate(['/']);
                });
            }

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

        const title = 'Editar limite para alerta do módulo (em R$)';
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
                this._storageService.saveJWT(undefined).then((res) => {
                    this._alertService.defaultAlert("Oops!", null, "Sua sessão expirou, faça o login novamente!", ["Vamos lá!"]);
                    this._nav.navigate(['/']);
                });
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
                    message = `Limite de '${this.paraReais(limite)}' salvo com sucesso!`;
                    button = "Ok";
                }

                this._alertService.defaultAlert(header, null, message, [button]);
            } else {
                this._storageService.saveJWT(undefined).then((res) => {
                    this._alertService.defaultAlert("Oops!", null, "Sua sessão expirou, faça o login novamente!", ["Vamos lá!"]);
                    this._nav.navigate(['/']);
                });
            }
        });
    }

    detalharSensor(sensor: any) {
        this._nav.navigate(["/modulo/", sensor.macSensor, sensor.apelido]);
    }

    converteData(data: string) {
        return this._alertService.converteData(data);
    }

    calculaConsumo(qtdKw) {
        return this.consumo * qtdKw;
    }

    paraReais(valor) {
        return `R$ ${parseFloat(valor).toFixed(2).toString().replace('.', ',')}`
    }

    async logout() {
        await this._storageService.saveJWT(null);
        this._nav.navigate(['/']);
    }
}
