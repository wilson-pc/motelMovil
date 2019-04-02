import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-modal-view-statistics',
  templateUrl: 'modal-view-statistics.html',
})
export class ModalViewStatisticsPage {
  
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('pieCanvas') pieCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  
  barchart: any;
  lineChart : any;
  pieChart : any;
  doughnutChart : any;

  // Meses del año
  meses : any[] = ['Enero', 'Ferebrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalController : ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalViewStatisticsPage');
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

}
