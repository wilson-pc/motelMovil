import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Negocio } from '../../models/Negocio';
import { SocketServiceComportamiento } from '../../providers/socket-config/socket-config';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'page-modal-view-statistics',
  templateUrl: 'modal-view-statistics.html',
})
export class ModalViewStatisticsPage {
  
  // Variable Canvas
  @ViewChild('lineCanvas') lineCanvas;
  lineChart : any;

  // Variables fechas
  desde : any;
  hasta : any;
  nombreMes : string;

  // Meses del año
  meses : any[] = ['Enero', 'Ferebrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Variables externas
  negocio : Negocio;
  
  // Variables internas
  lista : any[] = [];
  cantidades : any[] = [];
  mesess : string[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalController : ViewController,
    public comportamientoSevice : SocketServiceComportamiento) {
   //   moment(fecha).add(datos.tiempo, 'hours')
      // Inicializacion
      this.getNegocio();
      this.desde = new Date().getFullYear() + '-01' + '-01';
      this.hasta = moment(new Date()).add(1,"M").format('YYYY-MM-DD');
      this.nombreMes = moment(new Date()).format('YYYY-MM-DD');
      this.connectionBackendSocket();
  }

  ionViewDidLoad() {
    let data = {
      idnegocio: this.negocio._id,
      rangofecha: {
        inicio: this.desde,
        fin: this.hasta
      }
    };
    this.comportamientoSevice.emit('visitas-grafica', data);
    console.log('ionViewDidLoad ModalViewStatisticsPage');
  }

  getNegocio(){
    this.negocio = this.navParams.get('id_negocio');
    console.log(this.negocio);
  }

  ngAfterViewInit(){
  
  }

  getLineChart(){
    var chart = new Chart(this.lineCanvas.nativeElement, {
      data : {
      labels: this.mesess,
      datasets: [{
        label: '2',
        fill: false,
        lineTension: 0.1,
        data: this.cantidades,
        backgroundColor: 'rgb(207, 20, 20)',
        borderColor: 'rgb(207, 20, 20)',
        borderCapStyle : 'butt',
        boderJoinStyle : 'miter',
        pointRadius: 4,
        pointHitRadius: 1,
        spanGaps: true
      }]
    },

    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    },

      type: 'line'
    })

    return chart;
  }

  atras(){
    this.modalController.dismiss();
  }

  // Conexion con el Backend
  connectionBackendSocket() {
    this.respuestaVerificarListaVisitas().subscribe((data: any) => {
      this.lista = data;
      console.log(this.lista);
     this.lista.forEach(element => {
        this.cantidades.push(element.visitas);
        console.log(element._id+'-01')
        this.mesess.push(this.meses[moment(element._id+'-01').month()]);
      });
      console.log("lista de visitas", this.lista);
      console.log("lista de cantidades", this.cantidades);
      console.log("lista de meses", this.mesess);
      
      setTimeout(() => {
        this.lineChart = this.getLineChart();
      }, 150)
    });
    
  }

  respuestaVerificarListaVisitas() {

		let observable = new Observable(observer => {
			this.comportamientoSevice.on('respuesta-visitas-grfica', (data) => {
        observer.next(data);
			});
		})
    return observable;
  }
}
