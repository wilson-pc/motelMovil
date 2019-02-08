import { Injectable, NgModule, NgZone } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { RutaServer } from './RutaApi';
//const config: SocketIoConfig = { url: 'http://localhost:8988', options: {} };


@Injectable()
export class SocketConfigService extends Socket {
  constructor() {

    super({ url: RutaServer.socket + "productos", options: {} });
  }

}

export class SocketUsuarioService2 extends Socket {
  constructor() {
    super({ url: RutaServer.socket + "usuarios", options: {} });
  }
}

export class SocketConfigHomeService extends Socket {
  constructor() {
    super({ url: RutaServer.socket + "home", options: {} });
  }
}

export class SocketLoginService extends Socket {
  constructor() {
    super({ url: RutaServer.socket + "login", options: {} });
  }
}
export class SocketNegocioService3 extends Socket {
  constructor() {
    super({
      url: RutaServer.socket + "negocios", options: {}
    })
  }
}
