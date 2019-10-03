import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../storage/storage.service";

@Injectable({
    providedIn: 'root'
})
export class WebservicesService {
    // _URL_WEBSERVICES = "http://cortezit.me/api/";
    _URL_WEBSERVICES = "http://192.168.43.43:3000/api/";

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

    private async mountAuthenticationHeader() {
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
