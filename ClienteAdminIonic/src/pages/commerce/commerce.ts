import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

@Component({
  selector: 'page-commerce',
  templateUrl: 'commerce.html',
})
export class CommercePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio'];
  public barChartType = 'line';
  public barChartLegend = false;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40]}
  ];
  ionViewDidLoad() {
  }

}
