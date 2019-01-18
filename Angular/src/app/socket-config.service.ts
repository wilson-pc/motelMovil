import { Injectable, NgModule, NgZone } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { RutaServer } from './RutaApi';
//const config: SocketIoConfig = { url: 'http://localhost:8988', options: {} };


@Injectable({
  providedIn: 'root'
})
export class SocketConfigService extends Socket  {


  constructor() {
    super({ url: RutaServer.socket+"productos", options: {} });
}

}
