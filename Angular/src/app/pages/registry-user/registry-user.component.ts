
import { BuscadorService } from './../../service/buscador.service';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from '../../models/Usuarios';
import { resizeBase64 } from 'base64js-es6';
import { SocketConfigService2, SocketConfigService3 } from '../../socket-config.service'
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../cryptoclave';
import { Negocio } from '../../models/Negocio';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-registry-user',
  templateUrl: './registry-user.component.html',
  styleUrls: ['./registry-user.component.css']
})
export class RegistryUserComponent implements OnInit,OnDestroy {
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
	errorMensaje: string;
	idUsuario: string;
	loginusuario: string;
	loginpassword: string;
  // Cabeceras de la Tabla
  headElements = ['Nro', 'Nombres', 'Apellidos', 'Genero', 'Email'];
	profileUser: Usuarios;
	negociosUsuario: Negocio[] = [];
	contentUserID: string;
	buttons:boolean=true;

	items: any = []
	term: string;

	OwnerSubscription: Array<Subscription> = [];

  constructor(private socket: SocketConfigService2, private socket3: SocketConfigService3, private modalService: NgbModal, private usuarioServ: UsuarioService, private buscador: BuscadorService) {
		this.profileUser = new Usuarios;

		this.titulo = "Administracion de Usuarios";
		this.usuario = new Usuarios;
		
		this.a = 1;
		// Model Negocios
		this.buscador.lugar = "clientes";
		this.usuarioServ.getOwner().subscribe((owner)=>{
			console.log(owner);
			console.log("Algo anda vien");
			this.usuarios = owner;
		})
  }
  
  cargarDrow(){
		console.log("nuevoi");

	}
	
	//Llenar el ng-select
	ngOnInit() {
		this.conn();
		this.usuarioServ.sendEmitGetOwner();
	}
	ngOnDestroy() {
		this.OwnerSubscription.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
	  }
	// ACCIONES DE LOS MODALS
	openModalView(content, id: string) {
		this.contentUserID = id;
		
		this.viewUser();
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
		this.idUsuario = undefined;
		this.modal.close();
		this.eliminar = false;
	}

	// COSUMO DE SERVICIOS


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
	}

	razonEliminar(event, Termino) {
		if (Termino.length > 12) {
			this.eliminar = true;
		} else {
			this.eliminar = false;
		}
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

	this.OwnerSubscription.push(this.usuarioServ.eventUpdate().subscribe((data: any) => {

			this.usuarios.filter(word => word._id == data._id)[0] = data;
			this.modal.close();

		}));
	
		this.respuestaBuscarUsuario().subscribe((data: any[]) => {
			console.log(data);
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
	  this.OwnerSubscription.push(this.usuarioServ.eventDeleteOwner().subscribe((data: any) => {
			
			if(data.exito){
			this.modal.close();
			this.eliminar = false;}
			else{

			}
		}));
		//eliminar negocio del panel de edicio

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
			this.socket.on('respuesta-buscar-usuarios-cliente', (data) => {
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

}
