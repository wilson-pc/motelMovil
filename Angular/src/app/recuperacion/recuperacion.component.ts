import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.component.html',
  styleUrls: ['./recuperacion.component.css']
})
export class RecuperacionComponent implements OnInit {
  isError:boolean=false;
  isExito:boolean=false;
  token:string;
  constructor(private route:ActivatedRoute,) { 
    this.token=this.route.snapshot.paramMap.get('token');
    console.log(this.token);
  }

  ngOnInit() {
  }
  guardarDatos(usuario,password,password1){
    if(password==password1){
           
    }
  }

}
