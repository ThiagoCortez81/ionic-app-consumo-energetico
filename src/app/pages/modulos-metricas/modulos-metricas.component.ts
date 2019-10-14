import {Component, OnInit} from '@angular/core';
import {AlertService} from "../../services/alert/alert.service";
import {WebservicesService} from "../../services/webservices/webservices.service";
import {ActivatedRoute} from "@angular/router";
import * as moment from 'moment';
import {interval} from "rxjs";
import {startWith, switchMap} from "rxjs/operators";

@Component({
    selector: 'app-modulos-metricas',
    templateUrl: './modulos-metricas.component.html',
    styleUrls: ['./modulos-metricas.component.scss'],
})
export class ModulosMetricasComponent implements OnInit {

    dismiss = true;

    macSensor: string;
    apelido: string;
    chartData: any;
    consumoTotal: string;
    diasParaBuscar: number;
    loading: any;

    constructor(private _ws: WebservicesService, private _alertService: AlertService, private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this.consumoTotal = "0";
        this.diasParaBuscar = 7;
        this.macSensor = this._route.snapshot.paramMap.get("modulo");
        this.apelido = this._route.snapshot.paramMap.get("apelido");
        this.initializeChart();
        this.selecionaBuscaDados(this.diasParaBuscar);
        this.inicializaPolling();
    }

    initializeChart() {
        // Chart Configuration
        this.chartData = {
            chart: {
                caption: `Consumo dos últimos ${this.diasParaBuscar} dias`,
                numberSuffix: "KW",
                theme: "candy",
                bgColor: "#222428",
                bgAlpha: "100"
            },
            // Chart Data
            data: []
        };
    }

    async selecionaBuscaDados(days: number) {
        this.diasParaBuscar = days;

        this.loading = await this._alertService.defaultLoading();
        this.buscarConsumo();
    }

    async buscarConsumo() {
        const buscaObj = this.retornaBuscarObj();
        this.chartData.data = [];

        this._ws.listarConsumoSensor(buscaObj).then(resp => resp.toPromise()).then(this.processarRespostaWS.bind(this));
    }

    inicializaPolling() {
        this.dismiss = false;

        interval(10000)
            .pipe(
                startWith(0),
                switchMap(() => this._ws.listarConsumoSensor(this.retornaBuscarObj()).then(resp => resp.toPromise()))
            )
            .subscribe(this.processarRespostaWS.bind(this));
    }

    retornaBuscarObj() {
        const now = moment();
        const dataMax = `${now.toISOString().substring(0, 10)} 23:59:59`;

        const dataAntes = now.subtract(this.diasParaBuscar, 'days');
        const dataMin = `${dataAntes.toISOString().substring(0, 10)} 00:00:00`;

        const buscaObj = {
            dataMin: dataMin,
            dataMax: dataMax,
            macSensor: this.macSensor
        };

        return buscaObj;
    }

    processarRespostaWS(resposta: any) {
        if (resposta.isAuthenticated) {
            this.consumoTotal = resposta.consumoTotal.toFixed(2).toString().replace('.', ',');

            this.chartData.data = [];
            const keys = Object.keys(resposta.dadosMedicoes);
            keys.map((row: any) => {
                const dia = row.split("-");
                const data = {
                    "label": `${dia[2]}/${dia[1]}/${dia[0]}`,
                    "value": resposta.dadosMedicoes[row]
                };

                this.chartData.data.push(data);
            });
            // TODO: Implementar polling, consumo total e notificações...
            this.chartData.chart.caption = `Consumo dos últimos ${this.diasParaBuscar} dias`;
        }

        if (this.loading != null && this.loading != undefined)
            this.loading.dismiss();
    }
}


