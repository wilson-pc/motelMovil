import { Denuncias } from './../../models/Denuncias';
import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketConfigComportamientoService, SocketConfigService } from '../../socket-config.service';
import { Productos } from '../../models/Productos';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {
  titulo: string;
  public isCollapsed = true;
  foto:string;
	modal: NgbModalRef;
  closeResult: string;
  listComplaints: Productos[];
  denuncias:any[]=[];
	elements: any = [
		{  producto: 'Rom Abuelo', nombreNegocio: 'LicoreriaCarla', negocio: 'Licoreria', admin: 'Carla', cantidadDenuncias: '65'}
		//user, pass
	];
	// Cabezeras de los elementos
	headElements = ['Nro', 'Producto', 'Negocio', 'Tipo Negocio', 'Denuncias'];
  constructor(private modalService: NgbModal, private socketComportamiento: SocketConfigComportamientoService,private socketProducto:SocketConfigService) { 
    this.titulo = "ADMINISTRACION DE DENUNCIAS"
    this.listComplaints = [];
    // funcion para cargar datos en la lista
    this.conn();
    this.getComplaints();
  }

	ngOnInit() { 
		
	}

	// ACCIONES DE LOS MODALS

	openModalView(content,prod) {
    console.log(prod)
    this.foto=prod.foto.miniatura;
    this.socketProducto.emit("sacar-producto-denuncias",{_id:prod._id});
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop',size: 'lg' })    
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
  getComplaints() {
    this.socketComportamiento.emit("listar-denuncia", []);
  }

  conn() {
    console.log("primero");
    this.listComplaints = [];
    this.respuestaListarDenuncias().subscribe((data: any) => {
      console.log(data);
      this.listComplaints = data.datos;
    });
    this.eventGetprodcuto().subscribe((data)=>{
      console.log(data);
      this.denuncias=data.denuncias;
    })
  }

  eventGetprodcuto(){
    return this.socketProducto
    .fromEvent<any>("respuesta-sacar-producto-denuncias")
    .map( data => data );
   }

  respuestaListarDenuncias() {
    let observable = new Observable(observer => {
      this.socketComportamiento.on('respuesta-listar-denuncia', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
	delete(){

	}
}
