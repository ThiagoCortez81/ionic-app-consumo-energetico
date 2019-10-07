import {Component, OnInit} from '@angular/core';
import {AlertService} from "../../services/alert/alert.service";
import {WebservicesService} from "../../services/webservices/webservices.service";
import {ActivatedRoute} from "@angular/router";
import * as moment from 'moment';

@Component({
    selector: 'app-modulos-metricas',
    templateUrl: './modulos-metricas.component.html',
    styleUrls: ['./modulos-metricas.component.scss'],
})
export class ModulosMetricasComponent implements OnInit {

    macSensor: string;
    chartData: any;
    diasParaBuscar: number;
    loading: any;

    constructor(private _ws: WebservicesService, private _alertService: AlertService, private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this.diasParaBuscar = 7;
        this.macSensor = this._route.snapshot.paramMap.get("modulo");
        this.initializeChart();
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

        this.selecionaBuscaDados(this.diasParaBuscar);
    }

    async selecionaBuscaDados(days: number) {
        this.diasParaBuscar = days;

        this.loading = await this._alertService.defaultLoading();
        this.buscarConsumo();
    }

    async buscarConsumo() {
        const now = moment();
        const dataMax = `${now.toISOString().substring(0, 10)} 23:59:59`;

        const dataAntes = now.subtract(this.diasParaBuscar, 'days');
        const dataMin = `${dataAntes.toISOString().substring(0, 10)} 00:00:00`;

        const buscaObj = {
            dataMin: dataMin,
            dataMax: dataMax,
            macSensor: this.macSensor
        };

        this.chartData.data = [];

        this._ws.listarConsumoSensor(buscaObj).then(resp => resp.toPromise()).then((resposta: any) => {
            if (resposta.isAuthenticated) {
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
            this.loading.dismiss();
        });
    }

}
