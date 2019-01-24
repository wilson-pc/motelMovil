import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {
  titulo: string;
	public isCollapsed = true;
	modal: NgbModalRef;
	closeResult: string;

	elements: any = [
		{  producto: 'Rom Abuelo', nombreNegocio: 'LicoreriaCarla', negocio: 'Licoreria', admin: 'Carla', cantidadDenuncias: '65'}
		//user, pass
	];
	// Cabezeras de los elementos
	headElements = ['Nro', 'Producto', 'Negocio', 'Tipo Negocio', 'Administrador', 'Denuncias'];
  constructor(private modalService: NgbModal) { 
    this.titulo = "ADMINISTRACION DE DENUNCIAS"
  }

	ngOnInit() { 
		// funcion para cargar datos en la lista
		this.getAdmin();
	}

	// ACCIONES DE LOS MODALS

	openModalView(content) {
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}

	openModalDelete(content) {
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}

	cancelModal() {
		this.modal.close();
	}

	// COSUMO DE SERVICIOS

	delete(){

	}
	
	getAdmin(){

	}
}
