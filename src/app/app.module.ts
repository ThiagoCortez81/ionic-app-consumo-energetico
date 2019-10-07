import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from "./pages/login/login.component";
import {FormsModule} from "@angular/forms";
import {RegisterComponent} from "./pages/register/register.component";
import {LoginService} from "./services/login/login.service";
import {HttpClientModule} from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage'
import {StorageService} from "./services/storage/storage.service";
import {ModulosMetricasComponent} from "./pages/modulos-metricas/modulos-metricas.component";

// Import angular-fusioncharts
import { FusionChartsModule } from "angular-fusioncharts";

// Import FusionCharts library and chart modules
import * as FusionCharts from "fusioncharts";
import * as Charts from "fusioncharts/fusioncharts.charts";

import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.candy";

// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

@NgModule({
    declarations: [AppComponent, LoginComponent, RegisterComponent, ModulosMetricasComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicStorageModule.forRoot(), IonicModule.forRoot(), AppRoutingModule, FormsModule, HttpClientModule, FusionChartsModule],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        LoginService,
        StorageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
