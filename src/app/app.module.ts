import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './components/header/header.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SharedModule } from './modules/shared/shared.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NotificationsModule } from './modules/notifications/notifications.module';

import {
  MqttModule,
  IMqttServiceOptions
} from 'ngx-mqtt';
import { TokenInterceptor } from './token.interceptor';



export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: environment.mqtt.hostname,
  port: environment.mqtt.port,
  path: environment.mqtt.path,
  username: environment.mqtt.username,
  password: environment.mqtt.password
};


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    DashboardModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    NgxsModule.forRoot([], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),
    NotificationsModule,
    AppRoutingModule,
    NzGridModule,
    NzMenuModule,
    SharedModule,
    NzBadgeModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
