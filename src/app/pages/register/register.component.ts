import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {LoginService} from "../../services/login/login.service";
import {AlertController} from "@ionic/angular";
import {AlertService} from "../../services/alert/alert.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

    user = {
        nome: '',
        sobrenome: '',
        dataNascimento: '',
        email: '',
        senha: '',
        confirmarSenha: '',
    };
    loading: boolean;

    constructor(private _loginService: LoginService, private _alertService: AlertService, private router: Router) {
        this.loading = false;
    }

    ngOnInit() {
    }

    doRegistration(evt) {
        this.loading = true;
        evt.preventDefault();

        const objEnvio = {
            nome: this.user.nome,
            sobrenome: this.user.sobrenome,
            dataNascimento: moment(this.user.dataNascimento),
            email: this.user.email,
            senha: this.user.senha,
            confirmarSenha: this.user.confirmarSenha,
        };

        this._loginService.fazerCadastro(objEnvio).then((response: any) => {
            if (!response.success) {
                this._alertService.defaultAlert("Oops!", null, response.msg, ['Fechar'])
            } else {
                this._alertService.defaultAlert("Sucesso!", null, 'Obrigado por se cadastrar, agora voce pode fazer login na plataforma!', ['Vamos lá!']);
                this.router.navigate(['/'])
            }
            this.loading = false;
        });
    }


}
