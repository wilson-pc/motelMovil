import { Component, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { getAllDebugNodes } from '@angular/core/src/debug/debug_node';
import { Router } from '@angular/router';

@Component({
	templateUrl: './starter.component.html',
	styleUrls: ['./starter.component.css']
})
export class StarterComponent implements AfterViewInit {

	constructor(private rout: Router) {
	}

	ngAfterViewInit() { 
	}

	// Acciones de filtracion segun tipo de negocio
	openCommerceMotel(){
		this.rout.navigate(['/administracion/moteles']);
	}

	openCommerceLicor(){
		this.rout.navigate(['/administracion/licorerias']);
	}

	openCommerceSex(){
		this.rout.navigate(['/administracion/sexshops']);
	}
	OpenFormCommerce(){
		this.rout.navigate(['/administracion/formulario-negocios'])
	}

	// COSUMO DE SERVICIOS

}