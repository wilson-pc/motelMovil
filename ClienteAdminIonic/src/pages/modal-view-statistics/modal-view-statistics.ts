import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Negocio } from '../../models/Negocio';
import { SocketServiceComportamiento } from '../../providers/socket-config/socket-config';
import { Observable } from 'rxjs';

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

  // Meses del año
  meses : any[] = ['Enero', 'Ferebrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Variables externas
  negocio : Negocio;
  
  // Variables internas
  lista : any[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalController : ViewController,
    public comportamientoSevice : SocketServiceComportamiento) {
      // Inicializacion
      this.getNegocio();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalViewStatisticsPage');
  }

  getNegocio(){
    this.negocio = this.navParams.get('id_negocio');
    console.log(this.negocio);
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.lineChart = this.getLineChart();
    }, 150)
  }

  getLineChart(){
    var chart = new Chart(this.lineCanvas.nativeElement, {
      data : {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
      datasets: [{
        label: '1',
        fill: false,
        lineTension: 0.1,
        data: [12, 23, 15, 90, 5],
        backgroundColor: '#cc65fe',
        borderColor: '#cc65fe',
        borderCapStyle : 'butt',
        boderJoinStyle : 'miter',
        pointRadius: 4,
        pointHitRadius: 1,
        spanGaps: true
      },
      {
        label: '2',
        fill: false,
        lineTension: 0.1,
        data: [12, 200, 5, 80, 9],
        backgroundColor: 'rgb(207, 20, 20)',
        borderColor: 'rgb(207, 20, 20)',
        borderCapStyle : 'butt',
        boderJoinStyle : 'miter',
        pointRadius: 4,
        pointHitRadius: 1,
        spanGaps: true
      },
      {
        label: '3',
        fill: false,
        lineTension: 0.1,
        data: [12, 55, 5, 80, 9],
        backgroundColor: 'rgb(180, 20, 20)',
        borderColor: 'rgb(180, 20, 20)',
        borderCapStyle : 'butt',
        boderJoinStyle : 'miter',
        pointRadius: 4,
        pointHitRadius: 1,
        spanGaps: true
      },]
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
      console.log("lista de visitas", this.lista);
    });
    
  }

  respuestaVerificarListaVisitas() {
		let observable = new Observable(observer => {
			this.comportamientoSevice.on('visitas-grafica', (datos = {
        idnegocio: this.negocio._id,
        rangofecha: {
          inicio: this.desde,
          fin: this.hasta
        }
      }) => {
        observer.next(datos);
        console.log(observer);
        console.log("data",datos);
			});
		})
    return observable;
  }
}
