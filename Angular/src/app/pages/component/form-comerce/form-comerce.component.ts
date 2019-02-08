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

	listaMoteles:Negocio[]=[];
	listaLicorerias:Negocio[]=[];
	listaSexshop:Negocio[]=[];

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
  constructor(private route:ActivatedRoute,private servicioflag:UsuarioService,private socket:SocketConfigService3,private modalService: NgbModal, private usuarioServ:UsuarioService) { 
	var tit= this.route.snapshot.paramMap.get('negocio');
	this.titulo = "registro de "+ tit;
	this.tituloregistro="Formulario de Registro de "+tit;
		this.negocios=new Negocio;
		this.ListaNegocio=[];
		this.getNegocios();
		this.limpiarMensajes();
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
		var tit= this.route.snapshot.paramMap.get('negocio');

		if(tit=='moteles'){
			this.socket.emit("listar-negocio", { termino:'Motel'});
			this.negocios.tipo= "5c48958b734dbc052c531a0a" as any;
		}
		if(tit=='licorerias'){
			this.socket.emit("listar-negocio", { termino:'Licoreria'});
			this.negocios.tipo="5c4884160a1ca42b68044bc6" as any;
		}
		if(tit=='sexshops'){
			this.socket.emit("listar-negocio", { termino:'SexShop'});
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
		
		console.log(negocio);
	
		
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
		
	}

	update(){
		
		var date= new Date().toUTCString();
		this.isError=false;
		this.isRequired=false;
		this.isExito=false;		

		this.negocios.direccion={ubicaciongps:this.ubicaciongps,descripcion:this.descripcion};		
		this.negocios.modificacion={fecha:date,usuario:this.usuarioServ.usuarioActual.datos._id};

		let data={usuario:this.usuarioServ ,negocio: this.negocios}

		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data),clave.clave)
		this.socket.emit("actualizar-negocio",ciphertext.toString());
		this.socket.on('respuesta-actualizar-negocio',(data)=>{
			console.log("Entraste a respuesta");
			console.log(data);
		});
		console.log(this.descripcion);
		console.log(this.ubicaciongps);
		console.log(this.negocios);
	}


	limpiarCampos()
	{
		this.negocios=new Negocio;
		this.descripcion="";
		this.ubicaciongps="";		
	}
	limpiarMensajes(){						

		this.ListaNegocio=[];
		
		
		var tit= this.route.snapshot.paramMap.get('negocio');

		if(tit=='moteles'){
			this.socket.emit("listar-negocio", { termino:'Motel'});
			this.negocios.tipo= "5c48958b734dbc052c531a0a" as any;
			this.respuestaListarNegocio().subscribe((data: any[]) => {
				console.log("carga al array");
				this.ListaNegocio=data;
				//this.ListaNegocio=this.listaMoteles
				console.log(data);			
			
			});
		}
		else{
			if(tit=='licorerias'){
				this.socket.emit("listar-negocio", { termino:'Licoreria'});		
				this.respuestaListarNegocio().subscribe((data: any[]) => {
					console.log("carga al array");
					this.ListaNegocio=data;
					console.log(data);			
				
				});
			}else
			{
				if(tit=='sexshops'){
					this.socket.emit("listar-negocio", { termino:'SexShop'});
					this.respuestaListarNegocio().subscribe((data: any[]) => {
						console.log("carga al array");
						this.ListaNegocio=data;
						console.log(data);			
					
					});
				}		
			}
			

		}
		

		
		//console.log(this.ListaNegocio);	
				
	}
	
	conn() {
		this.ListaNegocio = [];
		this.respuestaCrear().subscribe((data: any) => {		
			
			if (data.datos) {
				
				this.isError = false;
				this.isRequired = false;
				this.isExito = true;
				this.limpiarMensajes();
				this.negocios = new Negocio;
				//this.ListaNegocio.push(data.datos);			
				setTimeout(()=>{
					this.cancelModal();
				},2000);				
			}
			else {
				this.isError = true;
				this.isRequired = false;
				this.isExito = false;
			}
		});
		this.respuestaActualizar().subscribe(data => {

		});
		
		
		this.respuestaBuscarUsuario().subscribe((data: any[]) => {
		console.log(data);
			this.ListaNegocio = data;
			
		});
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
			this.socket.on('respuesta-listar-negocio', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}

}
