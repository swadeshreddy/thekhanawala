import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { NavController } from "@ionic/angular";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private nav: NavController) {}

  canActivate(): boolean {
    if (!localStorage.getItem("token")) {
      this.nav.navigateForward("/login");
      return false;
    } else {
      return true;
    }
  }
}
