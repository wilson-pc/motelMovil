import { element } from 'protractor';
import { BuscadorService } from './../../service/buscador.service';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from '../../models/Usuarios';
import { getBase64, resizeBase64 } from 'base64js-es6';
import { SocketConfigService2, SocketConfigService3 } from '../../socket-config.service'
import { Observable, observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../cryptoclave';
import { FormControl } from '@angular/forms';
import { Negocio } from '../../models/Negocio';

@Component({
	selector: 'app-registry-owner',
	templateUrl: './registry-owner.component.html',
	styleUrls: ['./registry-owner.component.css']
})
export class RegistryOwnerComponent implements OnInit {
	titulo: string;
	public isCollapsed = true;
	modal: NgbModalRef;
	closeResult: string;
	isError: boolean = false;
	isExito: boolean = false;
	isRequired: boolean = false;
	user: string;
	password: string;
	eliminar: boolean = false;
	usuario: Usuarios;
	usuarios: Usuarios[] = [];
	a: any;
	idUsuario: string;
	usuarioActualizado:Usuarios;
	loginusuario:string;
	loginpassword:string;
	dropdownList = [];
	selectedItems = [];
	dropdownSettings = {};
	// Cabeceras de la Tabla
	headElements = ['Nro', 'Nombres', 'Apellidos', 'CI', 'Genero', 'Contacto', 'Email'];

	items: any = []
	term: string;
	negocio: Negocio;
	negocios: Negocio[];

	// Cabeceras de la Tabla
	constructor(private socket: SocketConfigService2, private socket3: SocketConfigService3, private modalService: NgbModal, private usuarioServ: UsuarioService, private buscador: BuscadorService) {

		this.titulo = "Usuarios Administradores";
		this.usuario = new Usuarios;
		
		this.getUsers();
		this.conn();
		this.a = 1;
		// Model Negocios
		this.negocio = new Negocio;
		this.usuarioActualizado=new Usuarios
		this.peticionSocketNegocio();
		this.buscador.lugar = "usuarios";
	}

	ejm() {
		alert("ejemplo");
	}

	ngOnInit() {

		this.selectedItems = [

		];
		this.dropdownSettings = {
			singleSelection: false,
			idField: '_id',
			textField: 'nombre',
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			itemsShowLimit: 3,
			allowSearchFilter: true
		};
	}
	onItemSelect(item: any) {
		console.log(item);
	}
	onSelectAll(items: any) {
		console.log(items);
	}
	onFilterChange(item: any) {

		if (item.length > 1) {
			let datos = this.negocios.filter(word => word.nombre.includes(item));
			if (datos.length > 0) {
				this.dropdownList = datos
			}

		}
	}
	peticionSocketNegocio() {
		this.socket3.emit("listar-negocio2", { data: "nada" });
	}

	getUsers() {
		this.socket.emit("listar-usuario", { data: "nada" });
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
	openModalUpdate(content,usuario) {
		this.usuarioActualizado=usuario;

		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
		this.modal.result.then((e) => {
		});
	}

	openModalDelete(content, id) {
		this.idUsuario = id;
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
		this.modal.result.then((e) => {
		});
	}

	cancelModal() {
		this.idUsuario=undefined;
		this.modal.close();
	}

	// COSUMO DE SERVICIOS
	add() {
		var date = new Date().toUTCString();
		this.isError = false;
		this.isRequired = false;
		this.isExito = false;
		//console.log(this.usuario,this.user,this.password);
		this.usuario.login = { usuario: this.user, password: this.password, estado: false };
		let seleccionados = [];
		this.usuario.rol = "5c45ef012f230f065ce7d830" as any;
		this.usuario.creacion = { fecha: date, usuario: this.usuarioServ.usuarioActual.datos._id }
		this.usuario.modificacion = { fecha: date, usuario: this.usuarioServ.usuarioActual.datos._id };
		this.selectedItems.forEach(element => {
			seleccionados.push(element._id);
		});
		let data = { usuario: this.usuario, negocio: seleccionados }
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.socket.emit("registrar-usuario", ciphertext.toString());
	}




	update() {
		var fecha=new Date().toUTCString();

		this.usuarioActualizado.modificacion={fecha:fecha,usuario:this.usuarioServ.usuarioActual.datos._id};
		let data = { usuario: this.usuarioActualizado }
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
	   console.log(this.usuarioActualizado);
	   
	   	this.socket.emit("actualizar-usuario", ciphertext.toString());
	}

	delete(razon) {
		let data = { id: this.idUsuario, razon: razon }

		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.socket.emit("eliminar-usuario", ciphertext.toString());
	}
	razonEliminar(event, Termino) {
		if (Termino.length > 12) {
			this.eliminar = true;
		} else {
			this.eliminar = false;
		}
	}
	changeListener($event): void {
		this.readThis($event.target);
	}

	//funcion que sirve para buscar la foto en la maquina y convertirlo a base64
	readThis(inputValue: any): void {
		var file: File = inputValue.files[0];
		//this.docente.perfil = { tipo: inputValue.files[0].type, foto: ""};
		var myReader: FileReader = new FileReader();

		myReader.onloadend = (e) => {
			// this.docente.perfil.foto = myReader.result.toString();
			// console.log(myReader.result.toString());
			resizeBase64(myReader.result, 400, 500).then((result) => {
				this.usuario.foto = result;


			});
		}
		myReader.readAsDataURL(file);
	}

	//
	conn() {
		this.negocios = [];
		this.respuestaCrear().subscribe((data: any) => {

			if (data.usuario) {

				this.isError =false;
				this.isRequired = false;
				this.isExito = true;
				this.usuarios.push(data.usuario);
				this.usuario=new Usuarios();
			}
			else {
				this.isError = true;
				this.isRequired = false;
				this.isExito = false;
			}
		});

		this.respuestaActualizar().subscribe((data:any) => {

		this.usuarios.filter(word => word._id==data._id)[0]=data;
      
		});
		this.respuestaListar().subscribe((data: any[]) => {
			this.usuarios = data;
	
		});
		this.respuestaListarNegocio().subscribe((data: any[]) => {
		
			this.dropdownList = data.slice(0, 3);
			this.negocios = data;

		});
		this.respuestaBuscarUsuario().subscribe((data: any[]) => {

			this.usuarios = data;
			//console.log(this.negocios)
		});
		this.respuestaEliminarUsuario().subscribe((data: any) => {
			


		   let fila= this.usuarios.filter(word => word._id==data._id)[0];

		var index = this.usuarios.indexOf(fila);
	    this.usuarios.splice(index,1);
		//	this.usuarios = data;
			//console.log(this.negocios)
		});
	}
	respuestaCrear() {
		let observable = new Observable(observer => {
			this.socket.on('respuesta-crear', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
	respuestaActualizar() {
		let observable = new Observable(observer => {
			this.socket.on('respuesta-actualizar-usuario', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}

	respuestaListar() {
		let observable = new Observable(observer => {
			this.socket.on('respuesta-listado', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}

	respuestaBuscarUsuario() {
		let observable = new Observable(observer => {
			this.socket.on('respuesta-buscar-usuarios', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
	//respuesta-buscar-usuarios
	respuestaListarNegocio() {
		let observable = new Observable(observer => {
			this.socket3.on('respuesta-listar-negocio2', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
	respuestaEliminarUsuario() {
		let observable = new Observable(observer => {
			//respuesta-eliminar-usuario
			this.socket.on('respuesta-eliminar-usuario', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}

}
