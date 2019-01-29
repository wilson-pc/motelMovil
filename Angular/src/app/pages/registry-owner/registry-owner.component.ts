
import { SocketConfigService } from './../../socket-config.service';
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
import { Socket } from 'net';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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
	errorMensaje:string;
	idUsuario: string;
	usuarioActualizado: Usuarios;
	loginusuario: string;
	loginpassword: string;
	dropdownList = [];
	selectedItems = [];
	dropdownSettings = {};
	// Cabeceras de la Tabla
	headElements = ['Nro', 'Nombres', 'Apellidos', 'CI', 'Genero', 'Contacto', 'Email'];
	profileUser: Usuarios;
	negociosUsuario: Negocio;
	contentUserID: string;

	items: any = []
	term: string;
	negocio: Negocio;
	negocios: Negocio[];

	// Cabeceras de la Tabla
	constructor(private socketProducto: SocketConfigService, private socket: SocketConfigService2, private socket3: SocketConfigService3, private modalService: NgbModal, private usuarioServ: UsuarioService, private buscador: BuscadorService) {
		this.profileUser = new Usuarios;
		
		this.titulo = "Usuarios Administradores";
		this.usuario = new Usuarios;
  this.errorMensaje="Error no se pudo guardar el registro."
		this.getUsers();
		this.conn();
		this.a = 1;
		// Model Negocios
		this.negocio = new Negocio;
		this.usuarioActualizado = new Usuarios
		this.peticionSocketNegocio();
		this.buscador.lugar = "usuarios";
		
	}
	
	//Llenar el ng-select
	ngOnInit() {

		this.selectedItems = [

		];
		this.dropdownSettings = {
			singleSelection: false,
			idField: '_id',
			textField: 'nombre',
			selectAllText: 'Seleccionar Negocios',
			unSelectAllText: 'Descelecionar Negocios',
			itemsShowLimit: 5,
			allowSearchFilter: true
		};
	}

	onItemSelect(item: any) {
	}

	onSelectAll(items: any) {
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
		console.log("Gatos");
		this.socket3.emit("listar-negocio2", { data: "nada" });
		this.socket3.on('respuesta-listar-negocio2', (data) => {
	      console.log(data);
			console.log("soy el mejor");
		});
	}

	getUsers() {
		this.socket.emit("listar-usuario", { data: "nada" });
	}

	// ACCIONES DE LOS MODALS
	openFromRegistry(content) {
		this.peticionSocketNegocio();
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
		this.modal.result.then((e) => {
		});
	}

	openModalView(content, id: string) {
		this.contentUserID = id;
		this.viewUser();
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
		this.modal.result.then((e) => {
		});
	}

	openModalUpdate(content, usuario) {
		this.selectedItems = [];
		this.usuarioActualizado = this.usuarios.filter(word => word._id == usuario._id)[0];
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
		this.modal.result.then((e) => {
		});
		//Obtener listado de negocios
		this.negocioActualPorEvento(this.usuarioActualizado._id);
		console.log(this.usuarioActualizado);
	}

	openModalDelete(content, id) {
		this.idUsuario = id;
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
		this.modal.result.then((e) => {
		});

		//Obtener listado de negocios antes de eliminar
		this.negocioActualPorEvento(id);
	}

	cancelModal() {
		this.idUsuario = undefined;
		this.modal.close();
		this.eliminar = false;
	}
	validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	// COSUMO DE SERVICIOS
	add() {
		var date = new Date().toUTCString();
		this.isError = false;
		this.isRequired = false;
		this.isExito = false;
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

		if (this.usuario.nombre != undefined && this.usuario.apellidos != undefined && this.user != undefined && this.selectedItems.length > 0 && this.validateEmail(this.usuario.email)) {
			this.socket.emit("registrar-usuario", ciphertext.toString());
		}
		else {
			this.isRequired = true;
		}

	}

	update() {
		var fecha = new Date().toUTCString();

		this.usuarioActualizado.modificacion = { fecha: fecha, usuario: this.usuarioServ.usuarioActual.datos._id };

		let seleccionados = [];
		this.selectedItems.forEach(element => {
			seleccionados.push(element._id);
		});
		let data = { usuario: this.usuarioActualizado, negocio: seleccionados }
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);


		this.socket.emit("actualizar-usuario", ciphertext.toString());
	}

	delete(razon) {
		let data = { id: this.idUsuario, razon: razon }

		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.socket.emit("eliminar-usuario", ciphertext.toString());
	}
	

	viewUser(){
		let data = { id: this.contentUserID}
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.socket.emit("sacar-usuario", ciphertext.toString());
		this.verificarNegocioUsuario();
	}

	razonEliminar(event, Termino) {
		if (Termino.length > 12) {
			this.eliminar = true;
		} else {
			this.eliminar = false;
		}
	}

	verificarNegocioUsuario(){
		let data = { id: this.contentUserID, tipo: "negocios"}
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.socket3.emit("listar-negocios-de-usuario", ciphertext.toString());
	}

	negocioActualPorEvento(id){
		let data = { id: id, tipo: "negocios"}
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.socket3.emit("listar-negocios-de-usuario", ciphertext.toString());
	}
	//funcion para buscar imagen dentro de la maquina
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

	//Metodo para ejecutar los evenListener de socket
	conn() {
		this.negocios = [];
		this.respuestaCrear().subscribe((data: any) => {
        
			if (data.exito) {

				console.log(data);
				this.isError = false;
				this.isRequired = false;
				this.isExito = true;
				//this.usuarios.push(data.usuario);
				this.usuario = new Usuarios();
				this.user = "";
				this.password = "";
				
				this.selectedItems = [];
			}else
			if(data.mensaje){
				this.isError = true;
				this.errorMensaje="Este usuario ya esta registrado"
			}else
			 {
				this.isError = true;
				this.isRequired = false;
				this.isExito = false;
				this.errorMensaje="Error no se pudo crear el registro";
			}
		});

		this.respuestaActualizar().subscribe((data: any) => {

			this.usuarios.filter(word => word._id == data._id)[0] = data;
			this.modal.close();

		});
		this.respuestaListar().subscribe((data: any[]) => {
			this.usuarios = data;

		});
		this.respuestaBuscarUsuario().subscribe((data: any[]) => {
			this.usuarios = data;
		});
		
		//Sacar Usuario
		this.respuestaSacarUsuario().subscribe((data: any) => {
			this.profileUser = data;
		});

		this.respuestaNuevousuario().subscribe((data: any) => {
	  console.log(data);
			this.usuarios.push(data.usuario)
		});

		// verificar negocio
		this.respuestaVerificarNegocio().subscribe((data: any) => {
			this.negociosUsuario = data;
			console.log(this.negociosUsuario)
		});
		this.respuestaListarNegocio().subscribe((data: any[]) => {
			this.dropdownList = data.slice(0, 3);
			this.negocios = data;

		});
		this.respuestaEliminarUsuario().subscribe((data: any) => {
			console.log("hjvhv");
			console.log(data);
			if(data.exito){
			this.modal.close();
			this.eliminar = false;}
			else{

			}
		});

		this.socket.on('respuesta-eliminar-usuario-todos', (data) => {
			let fila = this.usuarios.filter(word => word._id == data._id)[0];

			var index = this.usuarios.indexOf(fila);
			this.usuarios.splice(index, 1);
		});

		this.socket.on('respuesta-actualizar-usuario-todos', (data) => {
			
		   let fila=this.usuarios.filter(word => word._id == data._id)[0];
		   var index = this.usuarios.indexOf(fila);
		   this.usuarios[index]=data;
			console.log(this.usuarios);
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
	//respuesta-actualizar-usuarios
	respuestaActualizar() {
		let observable = new Observable(observer => {
			this.socket.on('respuesta-actualizar-usuario', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}

	//respuesta-listar-usuarios
	respuestaListar() {
		let observable = new Observable(observer => {
			this.socket.on('respuesta-listado', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
	//respuesta-buscar-usuario
	respuestaBuscarUsuario() {
		let observable = new Observable(observer => {
			this.socket.on('respuesta-buscar-usuarios', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
	//respuesta-buscar-negocio
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
	respuestaSacarUsuario(){
		let observable = new Observable(observer => {
			//respuesta-eliminar-usuario
			this.socket.on('respuesta-sacar-usuario', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
	respuestaVerificarNegocio(){
		let observable = new Observable(observer => {
			this.socket3.on('respuesta-listar-negocio-de-usuario', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
	respuestaNuevousuario(){
		let observable = new Observable(observer => {
			this.socket.on('respuesta-crear-todos', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
}

//