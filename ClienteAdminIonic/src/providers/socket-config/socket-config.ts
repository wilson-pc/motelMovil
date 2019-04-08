import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { RutaServer } from '../../app/RutaApi';
//const config: SocketIoConfig = { url: 'http://localhost:8988', options: {} };


@Injectable()
export class SocketServiceProduct extends Socket {
  constructor() {

    super({ url: RutaServer.socket + "productos", options: {} });
  }

}

export class SocketServiceUser extends Socket {
  constructor() {
    super({ url: RutaServer.socket + "usuarios", options: {} });
  }
}

export class SocketServiceHomeService extends Socket {
  constructor() {
    super({ url: RutaServer.socket + "home", options: {} });
  }
}
export class SocketServiceCommerce extends Socket {
  constructor() {
    super({
      url: RutaServer.socket + "negocios", options: {}
    })
  }
}
export class SocketServiceComportamiento extends Socket {
  constructor() {
    super({
      url: RutaServer.socket + "comportamiento", options: {}
    })
  }
}
