import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../../app.component";
import {WebservicesService} from "../../../services/webservices/webservices.service";
import {AlertService} from "../../../services/alert/alert.service";
import {Router} from "@angular/router";

@Component({
    selector: 'tab-modulos',
    templateUrl: 'modulos.page.html',
    styleUrls: ['modulos.page.scss']
})
export class ModulosPage implements OnInit {

    appName = AppComponent.appName;
    selectedSensor: any;
    listSensores: any;

    constructor(private _ws: WebservicesService, private _alertService: AlertService, private _nav: Router) {
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

                this._alertService.defaultAlert( header, null, message, [button]);
            } else {
                this._alertService.defaultAlert("Oops!", null, "Sua sessão expirou, faça o login novamente!", ["Vamos lá!"]);
            }
        });
    }

    detalharSensor(sensor: any) {
        this._nav.navigate(["/modulo/", sensor.macSensor]);
    }
}
