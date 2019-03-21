import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Chart } from 'chart.js';

@IonicPage()
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
      this.barchart = this.getBarChart();
      this.lineChart = this.getLineChart();
    }, 150)
    setTimeout(() => {
      this.pieChart = this.getPieChart();
      this.doughnutChart = this.getdoughnutChart();
    }, 250)
  }

  getChart(context, chartType, data, options){
    return new Chart(context, {
      data,
      options,
      type: chartType
    })
  }

  getBarChart(){
    const data = {
      labels: ['Vernelho', 'Azul', 'Amarelo', 'Verde', 'Roxo'],
      datasets: [{
        label: 'Numero de votos',
        data: [12, 23, 15, 90, 5],
        backgroundColor: [
          'rgb(255,0,0)',
          'rgb(20,0,255)',
          'rgb(255,230,0)',
          'rgb(0,255,10)',
          'rgb(60,0,70)',
        ],
        borderWidth: 1
      }]
    };

    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    return this.getChart(this.barCanvas.nativeElement, 'bar', data, options)
  }

  getLineChart(){
    const data = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
      datasets: [{
        label: 'Menu de datos',
        fill: false,
        lineTension: 0.1,
        data: [12, 23, 15, 90, 5],
        backgroundColor: 'rgb(0 , 178, 255)',
        dorderColor: 'rgb(231, 205, 35)',
        borderCapStyle : 'butt',
        boderJoinStyle : 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        dat : [20, 15, 98, 4],
        scanGaps: false
      }, {
        label: 'Menu de datos',
        fill: false,
        lineTension: 0.1,
        data: [12, 23, 15, 90, 5],
        backgroundColor: 'rgb(117 , 0, 49)',
        dorderColor: 'rgb(51, 50, 46)',
        borderCapStyle : 'butt',
        boderJoinStyle : 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        dat : [29, 135, 13, 70],
        scanGaps: false
      }]
    }

    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    return this.getChart(this.lineCanvas.nativeElement, 'line', data, options)
  }

  getPieChart(){
    const data = {
      labels: ['Vermelho', 'Azul', 'Amarelo'],
      datasets : [{
        data : [300, 75, 224],
        backgroundColor : ['rgb(200, 6, 0', 'rgb(36, 0, 255)', 'rgb(242, 255, 0)']
      }]
    }

    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    return this.getChart(this.pieCanvas.nativeElement, 'pie', data, options)
  }

  getdoughnutChart(){
    const data = {
      labels: ['Vermelho', 'Azul', 'Amarelo'],
      datasets: [{
        label: 'texte Chart',
        dat : [12, 65, 32],
        backgroundColor: [
          'rgb(0, 244, 97)',
          'rgb(37, 39, 43)',
          'rgb(255, 207, 0)'
        ]
      }]
    }
    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    return this.getChart(this.doughnutCanvas.nativeElement, 'doughnut', data, options);
  }

  atras(){
    this.modalController.dismiss();
  }

}
