import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../storage/storage.service";

@Injectable({
    providedIn: 'root'
})
export class WebservicesService {
    _URL_WEBSERVICES = "http://cortezit.me/api/";

    constructor(private _http: HttpClient, private _storage: StorageService) {
    }

    login(payload) {
        return this.doPost(this.urlBuilder('login'), payload);
    }

    cadastrarUsuario(payload) {
        return this.doPost(this.urlBuilder('cadastrarUsuario'), payload);
    }

    async listarSensoresCliente() {
        const payload = {};
        const headers = await this.mountAuthenticationHeader();

        return this.doPost(this.urlBuilder('listarSensoresCliente'), payload, headers);
    }

    async alterarSensorApelido(payload) {
        const headers = await this.mountAuthenticationHeader();

        return this.doPost(this.urlBuilder('alterarSensorApelido'), payload, headers);
    }

    async alterarSensorLimite(payload) {
        const headers = await this.mountAuthenticationHeader();

        return this.doPost(this.urlBuilder('alterarSensorLimite'), payload, headers);
    }

    async alterarSensorLimitePico(payload) {
        const headers = await this.mountAuthenticationHeader();

        return this.doPost(this.urlBuilder('alterarSensorLimitePico'), payload, headers);
    }

    async listarConsumoSensor(payload) {
        const headers = await this.mountAuthenticationHeader();

        return this.doPost(this.urlBuilder('listarConsumoSensor'), payload, headers);
    }

    async storeToken(payload) {
        const headers = await this.mountAuthenticationHeader();

        return this.doPost(this.urlBuilder('storeToken'), payload, headers);
    }

    public async mountAuthenticationHeader() {
        return {
            'x-access-token': await this._storage.getJWT()
        };
    }

    private urlBuilder(endpoint: string): string {
        return `${this._URL_WEBSERVICES}${endpoint}`;
    }

    private doPost(url: string, payload: any, headers?: any) {
        return this._http.post(url, payload, {headers: headers});
    }
}
