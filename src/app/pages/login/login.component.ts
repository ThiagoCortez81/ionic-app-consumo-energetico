import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login/login.service";
import {AlertService} from "../../services/alert/alert.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    loading: boolean = false;
    userData = {
        email: '',
        senha: ''
    };

    constructor(private _loginService: LoginService, private _alertService: AlertService, private router: Router) {
    }

    ngOnInit() {
    }

    fazerLogin(event) {
        this.loading = true;
        event.preventDefault();

        this._loginService.fazerLogin(this.userData).then((response: any) => {
            if (!response.success) {
                this._alertService.defaultAlert("Oops!", null, response.msg, ['Fechar'])
            } else {
                this.router.navigate(['/main'])
            }
            this.loading = false;
        });
    }

}
