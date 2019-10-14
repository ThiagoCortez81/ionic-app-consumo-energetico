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
import {IonicStorageModule} from '@ionic/storage'
import {StorageService} from "./services/storage/storage.service";
import {ModulosMetricasComponent} from "./pages/modulos-metricas/modulos-metricas.component";

// Import angular-fusioncharts
import {FusionChartsModule} from "angular-fusioncharts";

// Import FusionCharts library and chart modules
import * as FusionCharts from "fusioncharts";
import * as Charts from "fusioncharts/fusioncharts.charts";

import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.candy";
import {FirebaseX} from "@ionic-native/firebase-x/ngx";

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {LocalNotifications} from "@ionic-native/local-notifications/ngx";

// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

const config = {
    apiKey: "AIzaSyCqjR-96kZBjqEQsKSGJQRmG33268VPCQA",
    authDomain: "consumo-energ-169a4.firebaseapp.com",
    databaseURL: "https://consumo-energ-169a4.firebaseio.com",
    projectId: "consumo-energ-169a4",
    storageBucket: "",
    messagingSenderId: "798568064534",
    appId: "1:798568064534:web:2f67152cb2a711e1c43737"
};

@NgModule({
    declarations: [AppComponent, LoginComponent, RegisterComponent, ModulosMetricasComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        FusionChartsModule,
        AngularFireModule.initializeApp(config),
        AngularFirestoreModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        LoginService,
        StorageService,
        FirebaseX,
        LocalNotifications
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
