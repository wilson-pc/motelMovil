import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StarterComponent } from '../../starter/starter.component';
import { Negocio } from '../../../models/Negocio';
import { SocketConfigService3 } from '../../../socket-config.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-list-commerce',
  templateUrl: './list-commerce.component.html',
  styleUrls: ['./list-commerce.component.css']
})
export class ListCommerceComponent implements OnInit {
  tipoNegocio: string = '';
  listCommerce: Negocio[];
  closeResult: string;
  isError: boolean = false;
  isExito: boolean = false;
  isRequired: boolean = false;
  negocios: Negocio;

  // Cabezeras de los elementos
  headElements = ['Nro', 'Nombre', 'Cuartos Disponibles', 'Valoracion', 'Denuncias', 'Visitas'];

  constructor(private rout: Router, private route: ActivatedRoute, private socketNegocio: SocketConfigService3) {
    this.tipoNegocio = this.route.snapshot.paramMap.get('tipo');
    this.listCommerce = [];
    this.conn();
    this.getCommerces();
  }

  ngOnInit() {
  }

  // COSUMO DE SERVICIOS
  getCommerces() {
    if (this.tipoNegocio === 'moteles') {
      this.socketNegocio.emit("listar-negocio", { termino: "Motel" });
    }
  
  }

  conn() {
    this.listCommerce = [];
    this.respuestaListarNegocio().subscribe((data: any[]) => {
      this.listCommerce = data;
    });
  }

  respuestaListarNegocio() {
    let observable = new Observable(observer => {
      this.socketNegocio.on('respuesta-listar-negocio', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  // REDIRECCION A RUTAS SEGUN EVENTO
  openListProducts(commerce: any) {
    if (this.tipoNegocio === 'moteles') {
      this.rout.navigate(['/administracion/moteles/' + commerce.nombre]);
    }
    if (this.tipoNegocio === 'licorerias') {
      this.rout.navigate(['/administracion/licorerias/' + commerce.nombre]);
    }
    if (this.tipoNegocio === 'sexshops') {
      this.rout.navigate(['/administracion/sexshops/' + commerce.nombre]);
    }
  }
}
