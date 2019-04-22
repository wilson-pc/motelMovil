import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketConfigComportamientoService } from '../../socket-config.service';
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
	modal: NgbModalRef;
  closeResult: string;
  listComplaints: Productos[];

	elements: any = [
		{  producto: 'Rom Abuelo', nombreNegocio: 'LicoreriaCarla', negocio: 'Licoreria', admin: 'Carla', cantidadDenuncias: '65'}
		//user, pass
	];
	// Cabezeras de los elementos
	headElements = ['Nro', 'Producto', 'Negocio', 'Tipo Negocio', 'Administrador', 'Denuncias'];
  constructor(private modalService: NgbModal, private socketComportamiento: SocketConfigComportamientoService) { 
    this.titulo = "ADMINISTRACION DE DENUNCIAS"
    this.listComplaints = [];
    // funcion para cargar datos en la lista
    this.conn();
    this.getComplaints();
  }

	ngOnInit() { 
		
	}

	// ACCIONES DE LOS MODALS

	openModalView(content) {
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
  getComplaints() {
    this.socketComportamiento.emit("listar-denuncias", null);
  }

  conn() {
    this.listComplaints = [];
    this.respuestaListarDenuncias().subscribe((data: any[]) => {
      this.listComplaints = data;
      console.log(data);
    });
  }

  respuestaListarDenuncias() {
    let observable = new Observable(observer => {
      this.socketComportamiento.on('respuesta-listar-denuncias', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
	delete(){

	}
}
