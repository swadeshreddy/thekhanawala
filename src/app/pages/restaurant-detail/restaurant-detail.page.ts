import { AddAddressPage } from "./../add-address/add-address.page";
import { UtilService } from "./../../service/util.service";
import { ApiService } from "./../../service/api.service";
import { Component, OnInit } from "@angular/core";
import {
  PopoverController,
  NavController,
  ModalController,
} from "@ionic/angular";
import { PopoverPage } from "../popover/popover.page";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-restaurant-detail",
  templateUrl: "./restaurant-detail.page.html",
  styleUrls: ["./restaurant-detail.page.scss"],
})
export class RestaurantDetailPage implements OnInit {
  cartData: any = [];
  totalPrice: any = 0;
  totalItem: any = 0;
  bookmarkData: any = {};
  data: any = {};
  state: any = 1;
  vegonly: any = true;
  nonVeg: any = true;
  tempData: any;
  currency: any;
  shopId: any;
  defaultimage="../../../assets/default.png"
  loading: boolean=false
  constructor(
    private popoverController: PopoverController,
    private ntrl: NavController,
    private api: ApiService,
    private util: UtilService,
    private modalController: ModalController,
    private translate: TranslateService
  ) {
    this.currency = this.api.currency;
    // this.util.startLoad();
    this.loading=true
    this.cartData = JSON.parse(localStorage.getItem("cart-detail")) || [];
    console.log(this.cartData)
    localStorage.setItem('shopId', this.api.detailId)
    this.api
      .getDataWithToken("shopDetail/" + this.api.detailId)
      .subscribe((res: any) => {
        if (res.success) {
          this.data = res.data;
          console.log(this.data)
          this.loading=false
          this.data.bestSeller.forEach((element) => {
            element.type = "item";
            const fCart = this.cartData.find((x) => x.id == element.id && x.type == element.type);
            if (fCart) {
              element.qty = fCart.qty;
            } else {
              element.qty = 0;
            }
           
          });
          this.data.combo.forEach((ele) => {
            ele.type = "combo";
            const fCart = this.cartData.find((x) => x.id == ele.id && x.type == ele.type);
            if (fCart) {
              ele.qty = fCart.qty;
            } else {
              ele.qty = 0;
            }
          });

          this.tempData = res.data.bestSeller;
          this.api.menu = res.data.menu;
          // this.util.dismissLoader();
        }
      });
    /* this.cartData = JSON.parse(localStorage.getItem("cart-detail")) || []; */
    this.getCartdata();
  }

  ionViewWillEnter() {
    // this.util.startLoad();
    // setTimeout(() => {

    //   this.cartData = JSON.parse(localStorage.getItem("cart-detail")) || [];
    //   console.log(this.cartData)
    //   this.cartData.forEach(element => {
    //     if (element.shop_id != this.api.detailId) {
    //       this.shopId = element.shop_id
    //     }
    //   });
    //   if (this.cartData.length > 0) {
    //     console.log(this.data.bestSeller)
    //     if (this.data.bestSeller.length > 0) {
    //       this.data.bestSeller.forEach((el1) => {
    //         const fCart = this.cartData.find((x) => x.id == el1.id && x.type == el1.type);
    //         if (fCart) {
    //           el1.qty = fCart.qty;
    //         } else {
    //           el1.qty = 0;
    //         }
    //       });
    //     }
    //     if (this.data.combo.length > 0) {
    //       this.data.combo.forEach((el1) => {
    //         const fCart = this.cartData.find((x) => x.id == el1.id && x.type == el1.type);
    //         if (fCart) {
    //           el1.qty = fCart.qty;
    //         } else {
    //           el1.qty = 0;
    //         }
    //       });
    //     }
    //   } else {
    //     this.data.bestSeller.forEach((el1) => {
    //       el1.qty = 0;
    //     });
    //   }
    //   this.getCartdata();
    //   // this.util.dismissLoader();
    // }, 2000);
    // if (this.api.cartData.cartDetail) {
    //   if (this.api.cartData.cartDetail.length >= 0) {
    //     if (this.data.bestSeller) {
    //       this.data.bestSeller.forEach((el1) => {
    //         let status = true;
    //         this.api.cartData.cartDetail.forEach((el2) => {
    //           if (el1.id == el2.id && el1.type == el2.type) {
    //             el1.qty = el2.qty;
    //           } else {
    //             status = false;
    //           }
    //         });
    //       });
    //     }
    //   } else {
    //     this.data.bestSeller.forEach((el1) => {
    //       el1.qty = 0;
    //     });
    //     this.data.combo.forEach((element) => {
    //       element.qty = 0;
    //     });
    //   }
    // }
  }

  ngOnInit() { }
  logScrolling(ev) {
    if (ev.detail.scrollTop >= 150) {
      this.state = 2;
    } else {
      this.state = 1;
    }
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: ev,
      translucent: true,
      backdropDismiss: true,
      cssClass: "popover",
    });
    return await popover.present();
  }

  Gotocart() {
    localStorage.setItem('restoCharge', this.data.rastaurant_charge);
    localStorage.setItem('delCharge', this.data.delivery_charge);
    localStorage.setItem('cancelCharge', this.data.cancle_charge);
    localStorage.setItem('latitude', this.data.latitude);
    localStorage.setItem('longitude', this.data.longitude);
    localStorage.setItem('radius', this.data.radius)
    if (this.cartData.length) {
      if (localStorage.getItem("token")) {
        if (localStorage.getItem("isaddress") == "false") {
          this.addAddress();
        } else {
          this.ntrl.navigateForward(["cart"]);
        }
      } else {
        this.ntrl.navigateForward("/login");
      }
    } else {
      this.translate.get("toasts").subscribe(async (val) => {
        // this.util.presentToast(val.cart_empty);
      });
    }
  }

  back() {
    this.ntrl.back();
  }

  goReview() {
    this.ntrl.navigateForward(["review"]);
  }

  addtocart(item) {

    this.cartData.forEach(element => {
      if (element.shop_id != this.api.detailId) {
        localStorage.removeItem('cart-detail');
      }
    });

    item.qty = item.qty + 1;
    item.total = item.qty * item.price;

    this.cartData = JSON.parse(localStorage.getItem('cart-detail')) ? JSON.parse(localStorage.getItem('cart-detail')) : [];
    if (this.cartData.length > 0) {
      this.cartData.forEach((element, index) => {
        if (element.id === item.id && element.type == item.type) {
          this.cartData.splice(index, 1);
        }
      });
      this.cartData.push(item);
    } else {
      this.cartData.push(item);
    }
    localStorage.setItem('cart-detail', JSON.stringify(this.cartData));
    this.getCartdata();

  }

  minusQty(item) {
    if (item.qty !== 0) {
      item.qty--;
      item.total = item.qty * item.price;
      localStorage.setItem('cart-detail', JSON.stringify(this.cartData));
      if (this.cartData.length > 0) {
        let equalIndex;
        let equalType;
        this.cartData.forEach((element, ind) => {
          if (element.id == item.id && element.type == item.type) {
            equalIndex = ind;
          }
        });
        if (equalIndex >= 0) {
          if (item.qty == 0) {
            item.qty = 0;
            this.cartData.splice(equalIndex, 1);
            item.total = item.qty * item.price;
            localStorage.setItem('cart-detail', JSON.stringify(this.cartData))
          } else {
            this.cartData[equalIndex] = item;
            item.total = item.qty * item.price;
          }
        }
      }
    }

    this.getCartdata();
  }

  getCartdata() {
    this.totalPrice = 0;
    this.totalItem = 0;
    this.cartData.forEach(element => {
      this.totalPrice = this.totalPrice + element.total;
      this.totalItem = this.totalItem + element.qty;
    });
  }
  itemReview(id) {
    this.api.reviewId = id;
    this.ntrl.navigateForward("/item-review");
  }

  addBookmark() {
    this.bookmarkData.shop_id = this.data.id;

    this.api
      .postDataWithToken("addBookmark", this.bookmarkData)
      .subscribe((res: any) => {
        if (res.success) {
          if (this.data.isSeved) {
            this.data.isSeved = false;
            this.util.presentToast(res.msg);
          } else {
            this.data.isSeved = true;
            this.util.presentToast(res.msg);
          }
        }
      });
  }

  async addAddress() {
    const modal = await this.modalController.create({
      component: AddAddressPage,
    });
    return await modal.present();
  }

  vegOnlyItem() {
    if (this.vegonly == false || this.nonVeg == false) {
      this.data.bestSeller = this.tempData;
      if (this.vegonly == false) {
        this.data.bestSeller = this.data.bestSeller.filter((a) => {
          if (a.isVeg == 0) {
            return a;
          }
        });
      }
      if (this.nonVeg == false) {
        this.data.bestSeller = this.data.bestSeller.filter((a) => {
          if (a.isVeg > 0) {
            return a;
          }
        });
      }
    } else {
      this.data.bestSeller = this.tempData;
    }
  }
}
