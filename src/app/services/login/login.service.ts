import {Injectable} from '@angular/core';
import {WebservicesService} from "../webservices/webservices.service";
import {StorageService} from "../storage/storage.service";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private _ws: WebservicesService, private _storageService: StorageService) {
    }

    public async fazerLogin(userObj) {
        if (userObj.email != "" && userObj.senha != "") {
            const user: any = await this._ws.login(userObj).toPromise();

            if (user.success) {
                // Salvando dados
                this._storageService.saveValorKW(user.valorKW);
                this._storageService.saveJWT(user.token);
                this._storageService.saveUser(JSON.stringify(user.usuario));

                return {
                    success: user.success,
                    msg: 'Login efetuado com sucesso!'
                };
            } else
                return {
                    success: false,
                    msg: 'Combinação email/senha não conferem!'
                };
        } else
            return {
                success: false,
                msg: 'Preencha todos os campos!'
            };
    }

    public async fazerCadastro(userObj) {
        if (userObj.senha === userObj.confirmarSenha)
            return await this._ws.cadastrarUsuario(userObj).toPromise();
        else
            return {
                success: false,
                msg: 'As senhas inseridas não conferem'
            };
    }
}
