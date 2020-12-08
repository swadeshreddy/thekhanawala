import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { HomePage } from "./home.page";
import { HomePageRoutingModule } from "./home-routing.module";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    TranslateModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
