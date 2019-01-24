import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../../services/usuario.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  titulo: string;
  public isCollapsed = true;
  modal: NgbModalRef;
  closeResult: string;
  isError: boolean = false;
  isExito: boolean = false;
  isRequired: boolean = false;

  saldo = '150';
  today = new Date();
  hour = '';

  // Cabeceras de la Tabla
  usuarios: any = [
    {
      nombre: 'Carla',
      apellidos: 'Castillo Flores',
      tipo: 'admin',
      saldo: '1500'
    },
    {
      nombre: 'Rosio',
      apellidos: 'Castillo Flores',
      tipo: 'user',
      saldo: '150'
    },
  ];
  headElements = ['Nro', 'Nombres', 'Apellidos', 'Tipo Usuario', 'Saldo'];

  items: any = []
  term: string;
  validUser: string;

  constructor(private modalService: NgbModal, private usuarioServ: UsuarioService) {
    this.titulo = "BILLETERA ADMINISTRADORES / USUARIOS";
    // Hora actual
    this.hour = formatDate(this.today, 'dd-MM-yyyy hh:mm a', 'en-US');
    this.validUser = '';
  }

  ngOnInit() {
  }

  // ACCIONES DE LOS MODALS
  openModalView(content) {
    this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
    this.modal.result.then((e) => {
    });
  }

  openModalFormMoney(content, user: any) {
    this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })
    this.modal.result.then((e) => {
    });
    this.validUser = user.tipo;
  }

  cancelModal() {
    this.modal.close();
  }

  // COSUMO DE SERVICIOS
  addMoney() {

  }

  leaveMoney() {

  }
}
