import { Component, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { getAllDebugNodes } from '@angular/core/src/debug/debug_node';
@Component({
	templateUrl: './starter.component.html'
})
export class StarterComponent implements AfterViewInit {
	titulo: string;
	public isCollapsed = true;
	modal: NgbModalRef;
	closeResult: string;

	elements: any = [
		{ apellidos: 'Castillo Rosas', nombres: 'Carla', ci: '96854885', genero: "otro", contacto: "45685222", email: "servicio@gmail.com", }
		//user, pass
	];
	// Cabezeras de los elementos
	headElements = ['Nro', 'Nombres', 'Apellidos', 'CI', 'Genero', 'Contacto', 'Email'];

	constructor(private modalService: NgbModal) {
		this.titulo = "Usuarios Administradores"
	}

	ngAfterViewInit() { 
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