import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StarterComponent } from '../../starter/starter.component';


@Component({
  selector: 'app-list-commerce',
  templateUrl: './list-commerce.component.html',
  styleUrls: ['./list-commerce.component.css']
})
export class ListCommerceComponent implements OnInit {
  private tipoNegocio: string = '';
  elements: any = [
    { nombre: 'Licoreria Castillo', 
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

  constructor(private rout: Router, private route:ActivatedRoute) {
    this.tipoNegocio = this.route.snapshot.paramMap.get('tipo');
  }

  ngOnInit() {
    // funcion para cargar datos en la lista
    this.getAdmin();
  }


  // COSUMO DE SERVICIOS
  getAdmin() {

  }

  openListProducts(commerce: any){

    if(this.tipoNegocio === 'moteles'){
      this.rout.navigate(['/administracion/moteles/' + commerce.nombre]);
    }
    if(this.tipoNegocio === 'licorerias'){
      this.rout.navigate(['/administracion/licorerias/' + commerce.nombre]);
    }
    if(this.tipoNegocio === 'sexshops'){
      this.rout.navigate(['/administracion/sexshops/' + commerce.nombre]);
    }
  }
}
