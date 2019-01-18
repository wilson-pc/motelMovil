import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private rout: Router) { }

  ngOnInit() {
  }

  login(user: string, pass: string){
    let u="admin";
    let p="admin";
    if(u === user && p === pass){
    this.rout.navigate(['/administracion']);
    }
    
    this.rout.navigate(['/administracion']);
  }
}
