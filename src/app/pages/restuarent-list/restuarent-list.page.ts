import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-restuarent-list',
  templateUrl: './restuarent-list.page.html',
  styleUrls: ['./restuarent-list.page.scss'],
})
export class RestuarentListPage implements OnInit {

  constructor(private api: ApiService, private navCtrl: NavController ) { }
 defaultimage="../../../assets/default.png"
data:any={}
  ngOnInit() {
    this.getRestuarents()
  }
getRestuarents(){
  this.api.getDataWithToken("home").subscribe(
    (res: any) => {
      if (res.success) {
        // this.shoploading=false;
        console.log(res.data)
        this.data = res.data;
        // this.currency = this.api.currency;

        // this.getGrocery();
      }
    },
    (err) => {
      // this.util.dismissLoader();
      // this.err = err;
    }
  );
}
resturantDetail(id) {
  this.api.detailId = id;
  this.navCtrl.navigateForward(["restaurant-detail"]);
}
}
