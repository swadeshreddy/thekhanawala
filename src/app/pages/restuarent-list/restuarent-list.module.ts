import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RestuarentListPage } from './restuarent-list.page';

const routes: Routes = [
  {
    path: '',
    component: RestuarentListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RestuarentListPage]
})
export class RestuarentListPageModule {}
