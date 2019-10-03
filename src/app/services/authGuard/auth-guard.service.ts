import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {map, take} from "rxjs/operators";
import {StorageService} from "../storage/storage.service";
import {AlertService} from "../alert/alert.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private _storageService: StorageService, private _alertService: AlertService) {
    }

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        return this._storageService.getJWT().then(jwt => {
                if (!jwt) {
                    this._alertService.defaultAlert('Erro', null, 'Login inválido!', ['OK']);
                    return false;
                } else {
                    return true;
                }
            });
    }
}
