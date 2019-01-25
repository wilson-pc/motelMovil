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
  private tipoNegocio: string = '';
  listCommerce: Negocio[];
  closeResult: string;
  isError: boolean = false;
  isExito: boolean = false;
  isRequired: boolean = false;
  negocios: Negocio;


  elements: any = [
    {
      nombre: 'Licoreria Castillo',
      cantidadProductos: 'Carla',
      valoracion: '5',
      cantidadReportes: '10',
      cantidadVisitas: "1200",
      montoTotal: "3600",
      montoMesPasado: "3000",
      montoActual: "600",
    }
    //user, pass
  ];
  // Cabezeras de los elementos
  headElements = ['Nro', 'Nombre', 'Cantidad Productos', 'Valoracion', 'Reportes', 'Visitas', 'Monto Total', 'Monto Mes Pasado', 'Monto Actual'];

  constructor(private rout: Router, private route: ActivatedRoute, private socketNegocio: SocketConfigService3) {
    this.tipoNegocio = this.route.snapshot.paramMap.get('tipo');
    this.listCommerce = [];
    this.getCommerces();
  }

  ngOnInit() {
    console.log("Array");
    console.log(this.listCommerce);
  }


  // COSUMO DE SERVICIOS
  getCommerces() {
    this.socketNegocio.emit("listar-negocio", { data: "nada" });
  }

  conn() {
    this.listCommerce = [];
    this.respuestaListarNegocio().subscribe((data: any[]) => {
      console.log("carga al array de negocios");
      this.listCommerce = data;
      console.log(this.negocios)
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
