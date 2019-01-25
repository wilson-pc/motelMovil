import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from '../../../models/Usuarios';
import { Negocio } from '../../../models/Negocio';
import { getBase64, resizeBase64 } from 'base64js-es6';
import { UsuarioService } from '../../../services/usuario.service';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../../cryptoclave';
import { SocketConfigService3 } from '../../../socket-config.service';
import { Observable } from 'rxjs';
 
@Component({
  selector: 'app-form-comerce',
  templateUrl: './form-comerce.component.html',
  styleUrls: ['./form-comerce.component.css']
})
export class FormComerceComponent implements OnInit {

	titulo: string;
	tituloregistro:string;
	ubicaciongps:string;
	descripcion:string;

	flag=0;
	

	ListaNegocio:Negocio[]=[];


	public isCollapsed = true;
	modal: NgbModalRef;
	closeResult: string;
	isError:boolean=false;
	isExito:boolean=false;
	isRequired:boolean=false;
	negocios:Negocio;
	


	 
	elements: any = [
		{ negocio: 'Las tres hermanas', direccion: 'Av. Heroinas Nro 100', telefono: '96854885', titular: "Sir Angel", email: "servicio@gmail.com", }
		//user, pass
	];
	// Cabezeras de los elementos
	headElements = ['Nro', 'Nombre de Negocio', 'Direccion', 'Telefono', 'Email', 'Opciones'];
  constructor(private route:ActivatedRoute,private servicioflag:UsuarioService,private socket:SocketConfigService3,private modalService: NgbModal, private usuarioServ:UsuarioService,private socket3: SocketConfigService3) { 
	var tit= this.route.snapshot.paramMap.get('negocio');
	this.titulo = "Registrar"+ tit;
	this.tituloregistro= "Registro de"+this.route.snapshot.paramMap.get('negocio');
		this.negocios=new Negocio;
		this.ListaNegocio=[];
		this.getNegocios();
		this.conn();
		this.flag=0;		
		this.peticionSocketNegocio();	
		//console.log(this.route.snapshot.paramMap.get('negocio'));
	}

	ngOnInit() {
		console.log(this.servicioflag.nivelCommerce);
	}

	getNegocios() {
		this.socket.emit("listar-usuario", { data:'nada'});
		
	}
	peticionSocketNegocio() {

		if(this.servicioflag.nivelCommerce==1){
			this.socket3.emit("listar-negocio", { termino:'Motel'});
			this.negocios.tipo= "5c48958b734dbc052c531a0a" as any;
		}
		if(this.servicioflag.nivelCommerce==2){
			this.socket3.emit("listar-negocio", { termino:'Licorerias'});
			this.negocios.tipo="5c4884160a1ca42b68044bc6" as any;
		}
		if(this.servicioflag.nivelCommerce==3){
			this.socket3.emit("listar-negocio", { termino:'SexShop'});
			this.negocios.tipo="5c4895b7577cc931d01645ff" as any;
		}		
	}
	
	changeListener($event): void {
    this.readThis($event.target);
	}
	
	readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    console.log(inputValue.files[0]);
    //this.docente.perfil = { tipo: inputValue.files[0].type, foto: ""};
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
		 // this.docente.perfil.foto = myReader.result.toString();
		// console.log(myReader.result.toString());
      resizeBase64(myReader.result, 400, 500).then((result) => {
				this.negocios.foto = result;	
				
       
      });
    }
		myReader.readAsDataURL(file);
		
  }

 

  openFromRegistry(content,anyflag) {
	  this.flag=anyflag;
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}

	openModalView(content) {
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}
	openModalUpdate(content,negocio:Negocio,anyflag) {

		this.flag=anyflag;
		this.negocios=negocio;
		this.negocios.tipo=negocio.tipo._id as any;
		this.descripcion=negocio.direccion.descripcion;
		this.ubicaciongps=negocio.direccion.ubicaciongps;
		
		console.log(this.negocios );
	
		
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

		console.log(this.descripcion);
		console.log(this.ubicaciongps);
		var date= new Date().toUTCString();
		this.isError=false;
		this.isRequired=false;
		this.isExito=false;		

		this.negocios.direccion={ubicaciongps:this.ubicaciongps,descripcion:this.descripcion};
		this.negocios.creacion={usuario:this.usuarioServ.usuarioActual.datos._id,fecha:date};
		this.negocios.modificacion={fecha:date,usuario:this.usuarioServ.usuarioActual.datos._id};


		
		let data={negocio:this.negocios}
		 var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data),clave.clave)
		 this.socket.emit("registrar-negocio",ciphertext.toString());
		 this.socket.on('respuesta-registro-negocio',(data)=>{
		 	console.log("Entraste a respuesta");
		 	console.log(data);
		 });
		console.log(this.negocios);

	}


	limpiarCampos()
	{
		this.negocios=new Negocio;
		this.descripcion="";
		this.ubicaciongps="";	
		this.isError=false;
		this.isExito=false;
		this.isRequired=false;
		
		
	}

	conn() {
		this.ListaNegocio = [];
		this.respuestaCrear().subscribe((data: any) => {

			console.log("entro conn");
			
			if (data.datos) {
				console.log("correco");
				console.log(data);
				this.isError = false;
				this.isRequired = false;
				this.isExito = true;
				this.ListaNegocio.push(data.datos);
				this.limpiarCampos();
				
			}
			else {
				this.isError = true;
				this.isRequired = false;
				this.isExito = false;
			}
		});
		this.respuestaActualizar().subscribe(data => {

		});
		this.respuestaListar().subscribe((data: any[]) => {
			this.ListaNegocio = data;
			//console.log("Este es la lista");
			console.log(this.ListaNegocio);
		});
		this.respuestaListarNegocio().subscribe((data: any[]) => {
			console.log("carga al array");
			this.ListaNegocio = data;
			console.log(this.negocios)
		});
		this.respuestaBuscarUsuario().subscribe((data: any[]) => {
		console.log(data);
			this.ListaNegocio = data;
			//console.log(this.negocios)
		});
	}

	update(){
		console.log(this.descripcion);
		console.log(this.ubicaciongps);
		var date= new Date().toUTCString();
		this.isError=false;
		this.isRequired=false;
		this.isExito=false;		

		this.negocios.direccion={ubicaciongps:this.ubicaciongps,descripcion:this.descripcion};
		
		this.negocios.modificacion={fecha:date,usuario:this.usuarioServ.usuarioActual.datos._id};
	}

	delete(){

	}
	


	respuestaCrear() {
		let observable = new Observable(observer => {
			this.socket.on('respuesta-registro-negocio', (data) => {
				observer.next(data);
			});
		})
		console.log("entro respuesta crear");
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
			this.socket.on('respuesta-listar-negocio', (data) => {
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
			this.socket3.on('respuesta-listar-negocio', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}

}
