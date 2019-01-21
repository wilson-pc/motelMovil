import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
  titulo: string;
	public isCollapsed = true;
	modal: NgbModalRef;
	closeResult: string;

	elements: any = [
		{  nombre: 'Carla', cantidad: '968' }
		//user, pass
	];
	// Cabezeras de los elementos
	headElements = ['Nro', 'Nombre', 'cantidad'];

	constructor(private modalService: NgbModal) {
		this.titulo = "administracion de productos"
	}

	ngOnInit() { 
		// funcion para cargar datos en la lista
		this.getAdmin();
	}

	// ACCIONES DE LOS MODALS
	openFromRegistry(content) {
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}

	openModalView(content) {
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}
	openModalUpdate(content) {
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
	add(){

	}

	update(){

	}

	delete(){

	}
	
	getAdmin(){

	}
}