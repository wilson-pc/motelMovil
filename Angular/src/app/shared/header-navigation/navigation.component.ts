import { BuscadorService } from './../../service/buscador.service';
import { Component, AfterViewInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { SocketConfigService2, SocketConfigService3 } from '../../socket-config.service';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../cryptoclave';
import { Observable } from 'rxjs';

@Component({
    selector: 'ap-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements AfterViewInit {
    name: string;
    termino: string = "";
    constructor(private socket: SocketConfigService2, private rout: Router, public usuarioServ: UsuarioService, private buscador: BuscadorService, private socketNegocio: SocketConfigService3) {
        this.conn();
    }

    cerrarCesion() {

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ id: this.usuarioServ.usuarioActual.datos._id }), clave.clave);
        this.socket.emit("cerrar-secion", ciphertext.toString());

    }

    conn() {
        this.respuestaCerrar().subscribe((data: any) => {
          
            if (data.data) {
                localStorage.clear();
                this.usuarioServ.usuarioActual = undefined;
                this.rout.navigate(['/inicio']);
            } else {
                if(data.mensaje=="borrado"){
              console.log("elemeto borrado");
                }else{
                    alert("ocurrio un error al cerrar secion");
                }
            }
        });
    }
    respuestaCerrar() {
        let observable = new Observable(observer => {
            this.socket.on('respuesta-cerrar', (data) => {
                observer.next(data);
            });
        })
        return observable;
    }
    buscar(event) {

        if (this.termino.length > 1) {
            if (event.keyCode == 13) {
                this.buscador.Buscar(this.termino);
            }
        } else {
            // console.log(this.termino);
            //  console.log(this.buscador.lugar);
            if (this.buscador.lugar == "clientes") {
                this.socket.emit("listar-usuario-cliente", { termino: 'nada' });
            } else
                if (this.buscador.lugar == "usuarios") {

                    this.socket.emit("listar-usuario", { data: "nada" });
                } else
                    if (this.buscador.termino == "licorerias") {
                        console.log("entra a lico");
                        this.socketNegocio.emit("listar-negocio", { termino: 'Licoreria' });
                    } else
                        //sexshops
                        if (this.buscador.termino == "sexshops") {
                            this.socketNegocio.emit("listar-negocio", { termino: 'SexShop' });
                        } else
                            if (this.buscador.termino == "moteles") {
                                this.socketNegocio.emit("listar-negocio", { termino: 'Motel' });
                            }
        }
    }

    exitAdmin() {
        this.rout.navigate(['/administracion']);
    }

    // This is for Notifications
    notifications: Object[] = [{
        round: 'round-danger',
        icon: 'ti-link',
        title: 'Luanch Admin',
        subject: 'Just see the my new admin!',
        time: '9:30 AM'
    }, {
        round: 'round-success',
        icon: 'ti-calendar',
        title: 'Event today',
        subject: 'Just a reminder that you have event',
        time: '9:10 AM'
    }, {
        round: 'round-info',
        icon: 'ti-settings',
        title: 'Settings',
        subject: 'You can customize this template as you want',
        time: '9:08 AM'
    }, {
        round: 'round-primary',
        icon: 'ti-user',
        title: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:00 AM'
    }];

    // This is for Mymessages
    mymessages: Object[] = [{
        useravatar: 'assets/images/users/1.jpg',
        status: 'online',
        from: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:30 AM'
    }, {
        useravatar: 'assets/images/users/2.jpg',
        status: 'busy',
        from: 'Sonu Nigam',
        subject: 'I have sung a song! See you at',
        time: '9:10 AM'
    }, {
        useravatar: 'assets/images/users/2.jpg',
        status: 'away',
        from: 'Arijit Sinh',
        subject: 'I am a singer!',
        time: '9:08 AM'
    }, {
        useravatar: 'assets/images/users/4.jpg',
        status: 'offline',
        from: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:00 AM'
    }];

    ngAfterViewInit() {

        $(function () {
            $(".preloader").fadeOut();
        });

        var set = function () {
            var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
            var topOffset = 70;
            if (width < 1170) {
                $("body").addClass("mini-sidebar");
                $('.navbar-brand span').hide();
                $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
            } else {
                $("body").removeClass("mini-sidebar");
                $('.navbar-brand span').show();
            }

            var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $(".page-wrapper").css("min-height", (height) + "px");
            }

        };
        $(window).ready(set);
        $(window).on("resize", set);

        $(".search-box a, .search-box .app-search .srh-btn").on('click', function () {
            $(".app-search").toggle(200);
        });

        (<any>$('[data-toggle="tooltip"]')).tooltip();

        (<any>$('.scroll-sidebar')).slimScroll({
            position: 'left',
            size: "5px",
            height: '100%',
            color: '#dcdcdc'
        });

        $("body").trigger("resize");
    }
}
