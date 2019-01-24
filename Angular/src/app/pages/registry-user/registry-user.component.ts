import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../../services/usuario.service';
import { Usuarios } from '../../models/Usuarios';

@Component({
  selector: 'app-registry-user',
  templateUrl: './registry-user.component.html',
  styleUrls: ['./registry-user.component.css']
})
export class RegistryUserComponent implements OnInit {
  titulo: string;
  public isCollapsed = true;
  modal: NgbModalRef;
  closeResult: string;
  isError: boolean = false;
  isExito: boolean = false;
  isRequired: boolean = false;
  user: string;
  password: string;

  // Cabeceras de la Tabla
  usuarios: any = [{
    nombre: 'Carla',
    apellidos: 'Castillo Flores',
    denuncias: '3',
  }];
  headElements = ['Nro', 'Nombres', 'Apellidos', 'Denuncias'];

  items: any = []
  term: string;

  constructor(private modalService: NgbModal, private usuarioServ: UsuarioService) {
    this.titulo = "ADMINISTRACION DE USUARIOS";
    // Model Negocios
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

  openModalSuspent(content) {
    this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
    this.modal.result.then((e) => {
    });
  }

  cancelModal() {
    this.modal.close();
  }

  // COSUMO DE SERVICIOS
  delete() {

  }

  suspend(){

  }
}
