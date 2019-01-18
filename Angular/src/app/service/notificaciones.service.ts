import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketConfigService } from '../socket-config.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(private socket:SocketConfigService) {
    console.log("jrg bru gu");
    this.conn();
   }

  conn(){
    console.log(",pl,ol");
    this.getresponse().subscribe(data => {
      console.log(data);
    });
  }
  getresponse() {
    let observable = new Observable(observer => {
      this.socket.on('respuesta', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}
