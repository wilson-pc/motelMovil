import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(public router: Router) { }
  canActivate(): boolean {
    let cache=localStorage.getItem("usuario");
    if (cache==undefined) {
      console.log("sin login");
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
