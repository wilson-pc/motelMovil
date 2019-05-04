import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';
import { WebComponent } from './web/web.component';
import { LoginComponent } from './login/login.component';
import { SocketConfigService, SocketConfigService2, SocketConfigService3, SocketConfigHomeService, SocketConfigComportamientoService } from './socket-config.service';
import { Error404Component } from './pages/error404/error404.component';
import { RecuperacionComponent } from './recuperacion/recuperacion.component';
import { OwnerService } from './services/owner.service';
import {NgxSpinnerModule } from 'ngx-spinner';
import {AtomSpinnerModule} from 'angular-epic-spinners'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent, 
    SpinnerComponent,
    WebComponent,
    LoginComponent,
    Error404Component,
    RecuperacionComponent,
    
    
  ],
  imports: [
    SocketIoModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule,
    AtomSpinnerModule,
    NgbModule
    
  ],
  providers: [SocketConfigService,OwnerService,SocketConfigService2,SocketConfigService3,SocketConfigHomeService,SocketConfigComportamientoService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
