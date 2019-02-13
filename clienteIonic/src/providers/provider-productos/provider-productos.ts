import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Productos } from '../../models/Productos';
import { SocketConfigService } from '../../services/socket-config.service';
import { Observable } from 'rxjs';



@Injectable()
export class ProviderProductosProvider {

  listLicores:Productos[]=[];
  listSexshop:Productos[]=[];
  sw=0;
  parte:1;
  
  constructor (public http: HttpClient, private productService:SocketConfigService) {
    console.log('Hello ProviderProductosProvider Provider');
    this.listSexshop=[];  
    this.sw=0;
 
  }

  

}
