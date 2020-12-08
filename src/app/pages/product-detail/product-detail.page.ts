import { AddAddressPage } from "./../add-address/add-address.page";
import { GroceryService } from "./../../service/grocery.service";
import { UtilService } from "./../../service/util.service";
import { ApiService } from "./../../service/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController, ModalController } from "@ionic/angular";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.page.html",
  styleUrls: ["./product-detail.page.scss"],
})
export class ProductDetailPage implements OnInit {
  data: any = {};
  currency: any;
  review: any = [];
  cartData: any = [];
  dataa: any = {};
  constructor(
    private api: ApiService,
    private util: UtilService,
    private gpi: GroceryService,
    private nav: NavController,
    private modalController: ModalController
  ) {
    this.currency = this.api.currency;
  }

  ionViewWillEnter() {
    // this.util.startLoad();

    this.cartData = JSON.parse(localStorage.getItem("store-detail")) || [];
    this.cartData.forEach(element => {
      this.total = element.total
    });

    this.api.getDataWithToken("groceryItemDetail/" + this.gpi.itemId).subscribe(
      (res: any) => {
        if (res.success) {
          // this.util.dismissLoader();
          this.data = res.data;
          this.review = res.data.review;

          const fCart = this.cartData.find((x) => x.id == this.data.id);
          if (fCart && fCart.qty > 0) {
            this.data.qty = fCart.qty;

          } else {

            this.data.qty = 0;
          }
        }
      },
      (err) => {
        this.util.dismissLoader();
      }
    );
  }
  total: any;
  AddCart(item) {
    item.qty = item.qty + 1;
    item.total = item.qty * item.sell_price;
    this.total = item.total;
    this.cartData = JSON.parse(localStorage.getItem("store-detail")) || [];

    const fCart = this.cartData.find((x) => x.id == item.id);

    if (fCart) {
      fCart.qty = item.qty;
    } else {
      this.cartData.push(item);
    }
    localStorage.setItem("store-detail", JSON.stringify(this.cartData));
  }
  remove(item) {
    let equalIndex;
    if (item.qty == 0) return;
    item.qty = item.qty - 1;

    if (item.qty == 0) {
      const i = this.cartData.findIndex((x) => x.id == item.id);

      this.cartData.splice(i, 1);
    } else {
      item.total = item.qty * item.sell_price;
      this.total = item.total;
      this.cartData = JSON.parse(localStorage.getItem("store-detail")) || [];
      const fCart = this.cartData.find((x) => x.id == item.id);
      if (fCart) {
        fCart.qty = item.qty;
      }
    }

    localStorage.setItem("store-detail", JSON.stringify(this.cartData));
  }
  ngOnInit() { }
  cart() {
    if (this.cartData.length == 0) {
      this.util.presentToast("cart is empty");
    } else {
      this.gpi.cartData = this.cartData;
      if (localStorage.getItem("token")) {
        if (localStorage.getItem("isaddress") == "false") {
          this.addAddress();
        } else {
          this.nav.navigateForward("/grocery-cart");
        }
      } else {
        this.nav.navigateForward("/login");
      }
    }
  }
  async addAddress() {
    const modal = await this.modalController.create({
      component: AddAddressPage,
    });
    return await modal.present();
  }
}
