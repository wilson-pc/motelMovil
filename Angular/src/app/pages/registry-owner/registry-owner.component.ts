import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from '../../models/Usuarios';
import { getBase64, resizeBase64 } from 'base64js-es6';
import { SocketConfigService2 } from '../../socket-config.service'
import { Observable } from 'rxjs';
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
	isError:boolean=false;
	isExito:boolean=false;
	isRequired:boolean=false;
		user:string;
		password:string;
	 usuario:Usuarios;
	 usuarios:Usuarios[]=[];
	 a:any;
/*	elements: any = [
		{ apellidos: 'Castillo Rosas', nombres: 'Carla', ci: '96854885', genero: "otro", contacto: "45685222", email: "servicio@gmail.com", }
		//user, pass
	];*/
	// Cabezeras de los elementos
	headElements = ['Nro', 'Nombres', 'Apellidos', 'CI', 'Genero', 'Contacto', 'Email'];

  items : any = []
	term: string;
	negocio: Negocio;
	negocios: Negocio[];

	constructor(private socket:SocketConfigService2,private modalService: NgbModal,private usuarioServ:UsuarioService) {
		this.titulo = "Usuarios Administradores";
		this.usuario=new Usuarios;
		this.getUsers();
		this.conn();
		this.a=1;
		this.items = ["Kyle","Eric","Bailey", "Deborah", "Glenn", "Jaco", "Joni", "Gigi"]
		// Model Negocios
		this.negocio = new Negocio;
		this.getCommerce();
	}

	ejm(){
		alert("ejemplo");
	}

	ngOnInit() { 
		// funcion para cargar datos en la lista
		this.getAdmin();
	}

	getCommerce(){
		this.socket.emit("listar-negocio", {data: "nada"});
	}

	getUsers(){
		this.socket.emit("listar-usuario",{data:"nada"});
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
	// 	var date = new Date().toUTCString();
	// 	this.isError = false;
  //   this.isRequired = false;
  //   this.isExito = false;
	// //console.log(this.usuario,this.user,this.password);
	// this.usuario.login={usuario:this.user,password:this.password,estado:false};

	// this.usuario.rol="5c45ef012f230f065ce7d830" as any;
	// this.usuario.creacion = {fecha:date,usuario:this.usuarioServ.usuarioActual.datos._id} 
	// this.usuario.modificacion= {fecha:date,usuario:this.usuarioServ.usuarioActual.datos._id};
	// let data ={usuario:this.usuario}
	// var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
 this.socket.emit("registrar-negocio",{data:"l"});
	}

	
	

	update(){

	}

	delete(){

	}
	
	getAdmin(){

	}

	changeListener($event): void {
    this.readThis($event.target);
  }

  //funcion que sirve para buscar la foto en la maquina y convertirlo a base64
  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    console.log(inputValue.files[0]);
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
	conn(){
    this.respuestaCrear().subscribe((data:any) => {
		
     if(data.usuario){
			console.log("correco");
			console.log(data);
			this.isError = true;
			this.isRequired = true;
			this.isExito = true;
			this.usuarios.push(data.usuario);
		 }
		 else{
			this.isError = false;
			this.isRequired = false;
			this.isExito = false;
		 }
		});
		this.respuestaActualizar().subscribe(data => {
     
		});
		this.respuestaListar().subscribe((data:any[]) => {
			
      this.usuarios=data;
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
      this.socket.on('respuesta-actualizar', (data) => {
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
	
}
