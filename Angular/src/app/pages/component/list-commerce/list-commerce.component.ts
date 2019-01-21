import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-commerce',
  templateUrl: './list-commerce.component.html',
  styleUrls: ['./list-commerce.component.css']
})
export class ListCommerceComponent implements OnInit {

  elements: any = [
    { nombre: 'Licoreria Castillo', 
      cantidadProductos: 'Carla', 
      valoracion: '5',
      cantidadReportes: '10', 
      cantidadVisitas: "1200",
      montoTotal: "3600", 
      montoMesPasado: "3000", 
      montoActual: "600"
    }
    //user, pass
  ];
  // Cabezeras de los elementos
  headElements = ['Nro', 'Nombre', 'Cantidad Productos', 'Valoracion', 'Reportes', 'Visitas', 'Monto Total', 'Monto Mes Pasado', 'Monto Actual'];

  constructor() {
  }

  ngOnInit() {
    // funcion para cargar datos en la lista
    this.getAdmin();
  }


  // COSUMO DE SERVICIOS
  getAdmin() {

  }
}
