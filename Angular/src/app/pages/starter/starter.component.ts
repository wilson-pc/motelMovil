import { Component, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { getAllDebugNodes } from '@angular/core/src/debug/debug_node';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
	templateUrl: './starter.component.html',
	styleUrls: ['./starter.component.css']
})
export class StarterComponent implements AfterViewInit {

	constructor(private rout: Router, private flag:UsuarioService) {
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
	OpenFormCommerce(anyflag){
		
		this.flag.nivelCommerce=anyflag;
		if(this.flag.nivelCommerce==1){
			this.rout.navigate(['/administracion/formulario/moteles']);
		}
		if(this.flag.nivelCommerce==2){
			this.rout.navigate(['/administracion/formulario/licorerias']);
		}
		if(this.flag.nivelCommerce==3){
			this.rout.navigate(['/administracion/formulario/sexshops']);
		}
	}

	// COSUMO DE SERVICIOS

}