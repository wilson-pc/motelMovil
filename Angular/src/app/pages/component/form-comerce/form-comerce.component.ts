import { BuscadorService } from './../../../service/buscador.service';
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
	ubicacionFisica:string;
	latitud:number;
	longitud:number;
	datanew={};
	eliminar: boolean = false;
	razonBorrado:string;


	

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
	constructor(private buscador:BuscadorService,
		private route:ActivatedRoute,
		private servicioflag:UsuarioService,
		private socket:SocketConfigService3,
		private modalService: NgbModal, 
		private usuarioServ:UsuarioService,
		) {
			
		//	this.verificacionGeolocalizacion();
	var tit= this.route.snapshot.paramMap.get('negocio');
	this.titulo = "registro de "+ tit;
	
	// this.latitud=0;
	// this.longitud=0;

	this.buscador.lugar="negocios";
	this.buscador.termino=tit;
	this.tituloregistro="Formulario de Registro de "+tit;
		this.negocios=new Negocio;
		this.ListaNegocio=[];
		this.getNegocios();
		this.peticionSocketNegocio();	
		this.limpiarMensajes();
		this.conn();
		this.flag=0;		
		
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
			this.negocios.tipo= "5cd333fd021ca1a0384b2e24" as any;
		}
		if(tit=='licorerias'){
			this.socket.emit("listar-negocio", { termino:'Licoreria'});
			this.negocios.tipo="5cd33443021ca1a0384b4683" as any;
		}
		if(tit=='sexshops'){
			this.socket.emit("listar-negocio", { termino:'SexShop'});
			this.negocios.tipo="5cd3342b021ca1a0384b4511" as any;
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
      resizeBase64(myReader.result, 200, 300).then((result) => {
				this.negocios.foto = result;	
				
       
      });
    }
		myReader.readAsDataURL(file);
		
  }

  razonEliminar(event, Termino) {
		if (Termino.length > 12) {
			this.eliminar = true;
		} else {
			this.eliminar = false;
		}
	} 

  openFromRegistry(content,anyflag) {
	  this.flag=anyflag;
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}

	openModalView(content,negocio:Negocio) {
		this.negocios=negocio;
		
		this.negocios.tipo=negocio.tipo._id as any;
		this.ubicacionFisica=negocio.direccion.ubicacionFisica;
		this.latitud=negocio.direccion.latitud;
		this.longitud=negocio.direccion.longitud;
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}
	openModalUpdate(content,negocio:Negocio,anyflag) {

		console.log("modal",negocio);
		this.flag=anyflag;
		this.negocios=negocio;
		this.negocios.tipo=negocio.tipo._id as any;
		this.ubicacionFisica=negocio.direccion.ubicacionFisica;
		this.longitud=negocio.direccion.longitud;
		this.latitud= negocio.direccion.latitud;
		
		console.log(negocio);
	
		
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}

	openModalDelete(content,negocio:Negocio) {
	
		this.negocios._id=negocio._id;	
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}
	

	cancelModal() {
		this.modal.close();
		this.negocios=new Negocio;
		this.limpiarMensajes();
		this.razonBorrado="";
		this.eliminar = false;
	}

	verificaciondeCampos(){

		var bool = (this.negocios.nombre!=undefined && this.ubicacionFisica!=undefined && this.longitud!=undefined && this.latitud!=undefined &&
					this.negocios.telefono!=undefined && this.negocios.foto!=undefined && this.negocios.correo);
					 if(bool){
						var aux= this.validateEmail(this.negocios.correo)

						if(aux){
							return true;
						}
						else
						{
							return false;
						}

					 }
					 else{
						 return false;
					 }
					
	}

	validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
		
	}

	

	// COSUMO DE SERVICIOS
	add(){

		var date= new Date().toUTCString();
		this.isError=false;
		this.isRequired=false;
		this.isExito=false;	
	
			this.negocios.direccion={ubicacionFisica:this.ubicacionFisica,latitud:this.latitud,longitud:this.longitud};
			this.negocios.creacion={usuario:this.usuarioServ.usuarioActual.datos._id,fecha:date};
			this.negocios.modificacion={fecha:date,usuario:this.usuarioServ.usuarioActual.datos._id};
			console.log(this.negocios);
			console.log(this.verificaciondeCampos());
		var response=this.verificaciondeCampos();
			if(response)
			{
				let data={negocio:this.negocios}
				var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data),clave.clave)
				this.socket.emit("registrar-negocio",ciphertext.toString());
				
				this.socket.on('respuesta-registro-negocio-todos',(data)=>{
				console.log("Entraste a respuesta y estoy funcionando");
				console.log(data);
				});	

			}
			else{
				this.isRequired=true;
				this.isError=false;
				this.isExito=false;
				setTimeout(()=>{
					this.isRequired=false;
					
				},4000);	

			}
		 	
	}

	update(){
		
		var date= new Date().toUTCString();
		this.isError=false;
		this.isRequired=false;
		this.isExito=false;		

		this.negocios.direccion={ubicacionFisica:this.ubicacionFisica,longitud:this.longitud,latitud:this.latitud};
		
		this.negocios.modificacion={fecha:date,usuario:this.usuarioServ.usuarioActual.datos._id};

		var response=this.verificaciondeCampos();
		if(response)
		{
		

		let data={negocio:this.negocios}		
	
		 var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data),clave.clave)
		  this.socket.emit("actualizar-negocio",ciphertext.toString());
		  this.socket.on('respuesta-actualizar-negocio-todos',(data)=>{
			console.log("Entraste a respuesta y estoy funcionando");
		 	console.log(data);
		 	});	
		}
		else{
			this.isRequired=true;
			this.isError=false;
			this.isExito=false;
			setTimeout(()=>{
				this.isRequired=false;
				
			},4000);	
		}

	}

	delete(){

		var date= new Date().toUTCString();
		this.isError=false;
		this.isRequired=false;
		this.isExito=false;		

		
		
		this.negocios.modificacion={fecha:date,usuario:this.usuarioServ.usuarioActual.datos._id};
		this.negocios.eliminado={estado:true,razon:this.razonBorrado};

		
		if(this.negocios.eliminado.razon!=undefined)
		{
			this.datanew=this.negocios;
			let data={negocio:this.datanew}
		 var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data),clave.clave)
		 this.socket.emit("eliminar-negocio",ciphertext.toString());
		 this.socket.on('respuesta-elimina-negocio-todos',(data)=>{
		 	console.log("Entraste a respuesta eliminar");
		 	console.log(data);
		 });
		}
		else{
			this.isRequired=true;
			this.isError=false;
			this.isExito=false;
			setTimeout(()=>{
				this.isRequired=false;
				
			},4000);	
		}

		
		


	}

	


	limpiarCampos()
	{
		this.negocios=new Negocio;
		this.ubicacionFisica="";
		this.longitud=0;
		this.latitud=0;		
	}
	limpiarMensajes(){						

		this.ListaNegocio=[];
		
		
		var tit= this.route.snapshot.paramMap.get('negocio');

		

		if(tit=='moteles'){
			this.socket.emit("listar-negocio", { termino:'Motel'});
			this.negocios.tipo= "5cd333fd021ca1a0384b2e24" as any;
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
					this.isExito=false;
					this.cancelModal();
				},2000);				
			}
			else {
				this.isError = true;
				this.isRequired = false;
				this.isExito = false;
			}
		});


		this.respuestaTodosCrear().subscribe((data: any) => {		
			
			if (data.datos) {				
				
				this.limpiarMensajes();				
				//this.ListaNegocio.push(data.datos);					
			}		
		});

		this.respuestaTodosActualizar().subscribe((data: any) => {		
			
			if (data.datos) {				
				
				this.limpiarMensajes();				
				//this.ListaNegocio.push(data.datos);					
			}			
		});

		this.respuestaTodosBorrar().subscribe((data: any) => {		
			
			if (data.datos) {			
				
				this.limpiarMensajes();				
				//this.ListaNegocio.push(data.datos);					
			}			
		});

		

		this.respuestaActualizar().subscribe((data:any) => {

			if (data.datos) {
				
				this.isError = false;
				this.isRequired = false;
				this.isExito = true;
				this.limpiarMensajes();
				this.negocios = new Negocio;
				//this.ListaNegocio.push(data.datos);			
				setTimeout(()=>{
					this.isExito=false;
					this.cancelModal();
				},2000);				
			}
			else {
				this.isError = true;
				this.isRequired = false;
				this.isExito = false;
			}
		});
		this.respuestaBorrar().subscribe((data:any)=>{
			if (data.datos){
				this.isError=false;
				this.isRequired=false;
				this.isExito=true;
				this.limpiarMensajes();
				this.negocios=new Negocio
				setTimeout(()=>{
					this.isExito=false;
					this.cancelModal();
				},2000);				
			}
			else{
				this.isError = true;
				this.isRequired = false;
				this.isExito = false;
			}
			
		})
		
		// this.respuestaListarNegocio().subscribe((data: any[]) => {
		// 	console.log("carga al array");
		// 	this.ListaNegocio=data;
		// 	console.log(this.negocios)
		// });
		this.respuestaBuscarNegocio().subscribe((data: any[]) => {
		console.log(data);
			this.ListaNegocio = data;
			
		});
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

	respuestaTodosCrear(){
		let observable= new Observable(observer => {
			this.socket.on('respuesta-registro-negocio-todos',(data)=>{
				observer.next(data);
			});
		});

		return observable;
	}

	respuestaTodosActualizar(){
		let observable= new Observable(observer => {
			this.socket.on('respuesta-actualizar-negocio-todos',(data)=>{
				observer.next(data);
			});
		});
		return observable;
	}

	respuestaTodosBorrar(){
		let observable= new Observable(observer => {
			this.socket.on('respuesta-elimina-negocio-todos',(data)=>{
				observer.next(data);
			});
		});
		return observable;
	}


	respuestaBorrar(){
		let observable= new Observable(observer => {
			this.socket.on('respuesta-elimina-negocio',(data)=>{
				observer.next(data);
			});
		});

		return observable;
	}

	respuestaActualizar() {
		let observable = new Observable(observer => {
			this.socket.on('respuesta-actualizar-negocio', (data) => {
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
	respuestaBuscarNegocio() {
		let observable = new Observable(observer => {
			this.socket.on('respuesta-buscar-negocios', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}

	verificacionGeolocalizacion(){
		if(navigator.geolocation)
		{
			console.log("soporta navegacion");

			navigator.geolocation.getCurrentPosition(data =>{
				console.log("mi latitud es:",data.coords.latitude);
				console.log("mi longitud es:",data.coords.longitude);
				this.latitud=data.coords.latitude;
				this.longitud=data.coords.longitude;
			});

		}
		else{
			console.log("no soporta");
		}
	
	}

}
//respuesta-buscar-negocios