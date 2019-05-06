import { SocketConfigService } from './../../socket-config.service';
import { element } from 'protractor';
import { BuscadorService } from './../../service/buscador.service';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, ɵConsole, OnDestroy } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from '../../models/Usuarios';
import { getBase64, resizeBase64 } from 'base64js-es6';
import { SocketConfigService2, SocketConfigService3 } from '../../socket-config.service'
import { Observable, observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../cryptoclave';
import { FormControl } from '@angular/forms';
import { Negocio } from '../../models/Negocio';
import { Subscription } from 'rxjs/Subscription';
import { Socket } from 'net';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { OwnerService } from '../../services/owner.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registry-user',
  templateUrl: './registry-user.component.html',
  styleUrls: ['./registry-user.component.css']
})
export class RegistryUserComponent implements OnInit,OnDestroy {
	titulo: string;
	messageBool:boolean=false;
	public isCollapsed = true;
	modal: NgbModalRef;
	usuarioViewData:Usuarios;
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
	errorMensaje: string;
	idUsuario: string;
	usuarioActualizado: Usuarios;
	loginusuario: string;
	loginpassword: string;
	dropdownList = [];
	selectedItems = [];
	dropdownSettings = {};

  // Cabeceras de la Tabla
  headElements = ['Nro', 'Nombres', 'Apellidos', 'Genero', 'Email', 'Dias de suspencion'];
	profileUser: Usuarios;
	negociosUsuario: Negocio[] = [];
	contentUserID: string;
	buttons:boolean=true;

	razonText:string;

	items: any = []
	term: string;
	negocio: Negocio;
	negocios: Negocio[];

	OwnerSubscription: Array<Subscription> = [];

  constructor(
		private ownerService :OwnerService,
		private socket: SocketConfigService2,
		private socket3: SocketConfigService3,
		private modalService: NgbModal,
		private usuarioServ: UsuarioService,
		private buscador: BuscadorService,
		private spinner: NgxSpinnerService) 
		{
			//CODE CONSTRUCTOR HERE
							this.profileUser = new Usuarios;
							this.razonText="";
							this.titulo = "Administracion de Usuarios";
							this.usuario = new Usuarios;
							this.errorMensaje = "Error no se pudo guardar el registro."
							
							this.a = 1;
							// Model Negocios
							this.negocio = new Negocio;
							this.usuarioActualizado = new Usuarios
						
							this.buscador.lugar = "usuarios";
							this.usuarioServ.getOwner().subscribe((owner)=>{
								console.log(owner);
								console.log("Algo anda vien");
								this.usuarios = owner;
							});

							this.callSuspend();

  }
  
  cargarDrow(){
		console.log("nuevoi");
		this.peticionSocketNegocio();
	}
	
	spinerAction(){
		this.spinner.show();
 
    setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
		}, 5000);
	}
	//Llenar el ng-select
	ngOnInit() {
		//SPINER ACTION
		this.spinerAction();
		

		this.conn();
		this.usuarioServ.sendEmitGetOwner();
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
		console.log("dfrr");
		this.socket3.emit("listar-negocio2", { data: "nada" });
	  
		this.socket3.on('respuesta-listar-negocio2', (data) => {
			this.dropdownList = data.slice(0, 3);
			this.negocios = data;
			this.selectedItems=[];
		});
	}
	ngOnDestroy() {
		this.OwnerSubscription.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
	  }
	// ACCIONES DE LOS MODALS
	openFromRegistry(content) {
		this.selectedItems=[];
		this.peticionSocketNegocio();
		this.buttons=true;
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
		this.modal.result.then((e) => {
		});
	}

	openModalView(content, usuario:Usuarios) {
		//this.contentUserID = id;
		
		this.viewUser();
		this.usuarioViewData=usuario
		console.log("yo soy el usuario",this.usuarioViewData);
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
		this.modal.result.then((e) => {

		});
	}

	openModalSuspent(content,usuario:Usuarios){
		this.usuarioViewData=usuario;
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
		this.modal.result.then((e) => {
			
		});
	}

	openModalUpdate(content, usuario) {
		this.peticionSocketNegocio();
		this.selectedItems = [];
		this.usuarioActualizado = this.usuarios.filter(word => word._id == usuario._id)[0];
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
		this.modal.result.then((e) => {
		});
		//Obtener listado de negocios
		this.negocioActualPorEvento(this.usuarioActualizado._id);
	}

	openModalDelete(content, usuario:Usuarios) {
		this.usuarioViewData=usuario;
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
		this.modal.result.then((e) => {
		});

		//Obtener listado de negocios antes de eliminar
		//this.negocioActualPorEvento(id);
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
			this.buttons=false;
		    this.usuarioServ.saveOwner(ciphertext.toString());
		}
		else {
			this.isRequired = true;
		}

	}

	callSuspend(){
		this.socket.on('respuesta-suspender-usuario', data =>{
			console.log(data);
			this.messageBool=true;
			setTimeout(()=>{				
				 this.messageBool=false;
				 this.modal.close();
			},3000);		
			
		});
	}

	suspend(){
		console.log("hola");
		let data = new Usuarios;
		let fecha = new Date().toUTCString();
		let datos;
		data = this.usuarioViewData;
		data.suspendido.estado=true;
		data.suspendido.razon=this.razonText
		data.suspendido.duracion=10;
		data.suspendido.fecha= fecha as any;
		
		 datos={usuario:data};
		console.log(datos);
		if(this.razonText.length > 10){
			datos =this.encryptData(datos);
			console.log(datos);
			this.socket.emit('suspender-usuario',datos);	
		}
		else{
			this.isRequired=true;
			setTimeout(()=>{
				this.isRequired=false;				
			},5000)
		}
			
	}

	encryptData(data) {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
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

        this.usuarioServ.updateOwner(ciphertext.toString());
	}

	delete(razon) {
		let data = { id: this.idUsuario, razon: razon }

		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.eliminar=false;
		this.usuarioServ.deleteOwner(ciphertext.toString());
	}


	viewUser() {
		let data = { id: this.contentUserID }
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

	verificarNegocioUsuario() {
		let data = { id: this.contentUserID, tipo: "negocios" }
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.socket3.emit("listar-negocios-de-usuario", ciphertext.toString());
	}

	negocioActualPorEvento(id) {
		let data = { id: id, tipo: "negocios" }
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.socket3.emit("listar-negocios-de-usuario", ciphertext.toString());
	}

	removeCommerceTitular(negocio) {

		let fechaUTC = new Date().toUTCString();
		let usarioActualSesion = this.usuarioServ.usuarioActual.datos._id;
		let data = {
			negocio: {
				_id: negocio._id, eliminado: { estado: true, razon: "" },
				modificacion: { fecha: fechaUTC, usuario: usarioActualSesion }
			}
		}

		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.socket3.emit("eliminar-negocio-de-usuarios", ciphertext.toString());
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
			resizeBase64(myReader.result, 90, 100).then((result) => {
				this.usuario.foto = result;
			});
		}
		myReader.readAsDataURL(file);
	}


	
	//Metodo para ejecutar los evenListener de socket
	conn() {
		this.negocios = [];
		this.OwnerSubscription.push(this.usuarioServ.eventSaveOwner().subscribe((data: any) => {
			if (data.exito) {

				console.log("solo");
				this.isError = false;
				this.isRequired = false;
				this.isExito = true;
				this.buttons=true;
				this.usuario = new Usuarios();
				this.user = "";
				this.password = "";

			
			} else
				if (data.mensaje) {
					this.isError = true;
					this.buttons=true;

					this.errorMensaje = "Este usuario ya esta registrado"
				} else {
					this.isError = true;
					this.isRequired = false;
					this.isExito = false;
					this.buttons=true;

					this.errorMensaje = "Error no se pudo crear el registro";
				}
		}));

	this.OwnerSubscription.push(this.usuarioServ.eventUpdate().subscribe((data: any) => {

			this.usuarios.filter(word => word._id == data._id)[0] = data;
			this.modal.close();

		}));
	
		this.respuestaBuscarUsuario().subscribe((data: any[]) => {
			this.usuarios = data;
		});

		//Sacar Usuario
		this.respuestaSacarUsuario().subscribe((data: any) => {
			this.profileUser = data;
		});

	this.OwnerSubscription.push(this.usuarioServ.eventSaveOwnerAll().subscribe((data: any) => {
			console.log(data);
			this.usuarios.push(data.usuario)
		}));

		// verificar negocio
		this.respuestaVerificarNegocio().subscribe((data: any) => {
			this.negociosUsuario = data;
			console.log(this.negociosUsuario)
		});
		
	  this.OwnerSubscription.push(this.usuarioServ.eventDeleteOwner().subscribe((data: any) => {
			
			if(data.exito){
			this.modal.close();
			this.eliminar = false;}
			else{

			}
		}));
		//eliminar negocio del panel de edicion
		this.repuestaEliminarNegocio().subscribe((data: any) => {
			console.log(data);
			let fila = this.negociosUsuario.filter(word => word._id == data._id)[0];

			var index = this.negociosUsuario.indexOf(fila);
			console.log(index);
			this.negociosUsuario.splice(index, 1);
			//this.peticionSocketNegocio();
		});

		this.OwnerSubscription.push(this.usuarioServ.eventUpdateAll().subscribe((data)=>{
			let fila = this.usuarios.filter(word => word._id == data._id)[0];
			var index = this.usuarios.indexOf(fila);
			this.usuarios[index] = data;
			console.log(this.usuarios);
		 }))

	}
	//respuesta-actualizar-usuarios
	

	//respuesta-listar-usuarios
	
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


	respuestaSacarUsuario() {
		let observable = new Observable(observer => {
			//respuesta-eliminar-usuario
			this.socket.on('respuesta-sacar-usuario', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
	respuestaVerificarNegocio() {
		let observable = new Observable(observer => {
			this.socket3.on('respuesta-listar-negocio-de-usuario', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}

	repuestaEliminarNegocio() {
		let observable = new Observable(observer => {
			this.socket3.on('respuesta-elimina-negocio-de-usuario', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
}
