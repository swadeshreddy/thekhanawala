import { GroceryService } from "./../../service/grocery.service";
import { UtilService } from "../../service/util.service";
import { ApiService } from "../../service/api.service";
import { Component } from "@angular/core";
import * as moment from "moment";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@ionic-native/native-geocoder/ngx";
import {
  ModalController,
  NavController,
  MenuController,
  Platform,
} from "@ionic/angular";
import { FilterPage } from "../filter/filter.page";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  term: string;
  userAddress: any = {};
  err: any = {};
  currentTime: any;
  loading=false;
  shoploading=false
  isfood = true;
  sellProduct = 0;
  public staticData: any = {
    feature: [
      {
        image: "assets/image/diamond.svg",
        text: "Most Popular",
        type: "popular",
      },
      {
        image: "assets/image/near.svg",
        text: "Great Offers",
      },
      {
        image: "assets/image/express.svg",
        text: "Pure Veg Places",
        type: "pureveg",
      },
      {
        image: "assets/image/pocket.svg",
        text: "Pocket Friendly",
        type: "lowcost",
      },
      {
        image: "assets/image/shop.svg",
        text: "Nearest Me",
        type: "nearest",
      },
    ],
  };
  public slideOpts: any = {
    slidesPerView: "auto",
    centeredSlides: true,
    centeredSlidesBounds: true,
    spaceBetween: 20,
    initialSlide: 1,
    autoplay: {
      delay: 3000,
    },
    slideNextClass: "swiper-slide-next",
    slidePrevClass: "swiper-slide-next",
    slideActiveClass: "swiper-slide-active",
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  };
  data: any = {};
  grocery: any = {};
  btnType = "Exclusive";
  currency: any;
  Address: any;
  isAddressListVisible=false;
  trending = [
    {
      name: "Real Fruit Juice ,Litchi, (Pack of 2)",
      img: "../../../assets/image/real_juice.png",
      qty: "1Ltr",
      price: "$15.50",
    },
    {
      name: "Real Fruit Juice ,Litchi, (Pack of 2)",
      img: "../../../assets/image/real_juice.png",
      qty: "1Ltr",
      price: "$15.50",
    },
    {
      name: "Real Fruit Juice ,Litchi, (Pack of 2)",
      img: "../../../assets/image/real_juice.png",
      qty: "1Ltr",
      price: "$15.50",
    },
  ];

  public innerWidth: any = window.innerWidth;
  public banners: any = Array();
  addressList: any=[
  //   {
  //   address_type: "Office",
  //   city: "HYDERABAD",
  //   created_at: "2020-12-01 15:31:52",
  //   deleted_at: "0000-00-00 00:00:00",
  //   id: 19,
  //   lang: "78.39099831768772",
  //   lat: "17.451662256210017",
  //   soc_name: "124",
  //   street: "ayyappa society",
  //   updated_at: "2020-12-01 15:31:52",
  //   user_id: 43,
  //   zipcode: "500033"
  // }
  // },{
  //   address_type: "Home"
  //   city: "HYDERABAD"
  //   created_at: "2020-12-01 15:27:12"
  //   deleted_at: "0000-00-00 00:00:00"
  //   id: 18
  //   lang: "78.3772265"
  //   lat: "17.4839871"
  //   soc_name: "123"
  //   street: "ayyappa society"
  //   updated_at: "2020-12-01 15:27:12"
  //   user_id: 43
  //   zipcode: "500033"
  // },{
  //   address_type: "Home"
  //   city: "HYDERABAD"
  //   created_at: "2020-12-01 14:46:23"
  //   deleted_at: "0000-00-00 00:00:00"
  //   id: 17
  //   lang: "78.3772189"
  //   lat: "17.4839855"
  //   soc_name: "wuodbdgj"
  //   street: "dgkdkd"
  //   updated_at: "2020-12-01 14:46:23"
  //   user_id: 43
  //   zipcode: "500072"
  //   __proto__: Object
]
  constructor(
    private menu: MenuController,
    private modalController: ModalController,
    private navCtrl: NavController,
    private nativeGeocoder: NativeGeocoder,
    private api: ApiService,
    private util: UtilService,
    private gpi: GroceryService,
    private geolocation: Geolocation,
    private platform: Platform,
    private androidPermissions: AndroidPermissions
  ) {
    this.api.getData("keySetting").subscribe(
      (res: any) => {
        this.sellProduct = res.data.sell_product;
        if (this.sellProduct == 2) {
          this.isfood = false;
        }
        this.initData();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  private initData() {
    this.getAdvertisingBanner();
    this.getAddressList()
    // this.util.startLoad();
    this.loading=true;
    this.api.getDataWithToken("home").subscribe(
      (res: any) => {
        if (res.success) {
          this.loading=false;
          this.data = res.data;
          this.currency = this.api.currency;

          // this.getGrocery();
        }
      },
      (err) => {
        // this.util.dismissLoader();
        this.err = err;
      }
    );
  }

  getAdvertisingBanner(): void {
    this.loading=true;
    this.api.getData("banner").subscribe((res: any) => {
      if (res.success) {
        this.banners = res.data;
        this.loading=false
      }
    });
  }

  ionViewWillEnter() {
    this.menu.enable(true);
    if (localStorage.getItem("isaddress") != "false") {
      // this.util.startLoad();
      this.api
        .getDataWithToken("getAddress/" + localStorage.getItem("isaddress"))
        .subscribe(
          (res: any) => {
            if (res.success) {
              this.userAddress = res.data;
              // this.util.dismissLoader();
            }
          },
          (err) => {
            this.err = err;
            // this.util.dismissLoader();
          }
        );
    } else {
      if (this.platform.is("cordova")) {
       this.setCurrentLocation()
      } else {
        // this.getData();
      }
    }
  }
  setCurrentLocation(){
    this.androidPermissions
    .checkPermission(
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
    )
    .then((result) => {
      if (result.hasPermission) {
        // this.util.startLoad();
        this.geolocation
          .getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 5000,
          })
          .then((resp) => {
            console.log("resp", resp);

            resp.coords.latitude;
            resp.coords.longitude;
            this.userAddress.lat = resp.coords.latitude;
            this.userAddress.lang = resp.coords.longitude;
            this.gpi.current.lat = resp.coords.latitude;
            this.gpi.current.lang = resp.coords.longitude;
            const options: NativeGeocoderOptions = {
              useLocale: true,
              maxResults: 5,
            };
            this.nativeGeocoder
              .reverseGeocode(
                resp.coords.latitude,
                resp.coords.longitude,
                options
              )
              .then((result: NativeGeocoderResult[]) => {
                //this.util.dismissLoader();
                this.userAddress.address_type = "Delivary to";
                this.userAddress.soc_name = result[0].subLocality;
                this.userAddress.street = result[0].thoroughfare;
                this.userAddress.city = result[0].locality;
                this.userAddress.zipcode = result[0].postalCode;
              })
              .catch((error: any) => console.log(error));
          })
          .catch((error) => {
            this.util.dismissLoader();
          });
      } else {
        this.androidPermissions.requestPermission(
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
        );
      }
    });
    this.getAddressList()
    this.handleAddressView()
  }
  getAddressList(){
    this.api.getDataWithToken("userAddress").subscribe((res: any) => {
      if (res.success) {
        this.addressList = res.data;
        //   this.util.dismissLoader();
        // if (localStorage.getItem("isaddress")) {
        //   this.addressList.forEach((element) => {
        //     if (element.id == localStorage.getItem("isaddress")) {
        //       element.checked = true;
        //     }
        //   });
        // }
      }
    });
  }
  setAddress(address) {
   this.userAddress=address;
   this.handleAddressView()
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: FilterPage,
      cssClass: "filterModal",
      backdropDismiss: true,
    });
    modal.onDidDismiss().then((res) => {
      if (res["data"] != undefined) {
        let filetype;
        res.data.forEach((element) => {
          if (element.checked == true) {
            filetype = element.name;
          }
        });
        if (filetype == "Cost High to Low") {
          this.data.shop.sort((a, b) => {
            if (a.avarage_plate_price > b.avarage_plate_price) {
              return -1;
            }
            if (a.avarage_plate_price < b.avarage_plate_price) {
              return 1;
            }
            return 0;
          });
        } else if (filetype == "Top Rated" || filetype == "Most Popular") {
          this.data.shop.sort((a, b) => {
            if (a.rate > b.rate) {
              return -1;
            }
            if (a.rate < b.rate) {
              return 1;
            }
            return 0;
          });
        } else if (filetype == "Cost Low to High") {
          this.data.shop.sort((a, b) => {
            if (a.avarage_plate_price < b.avarage_plate_price) {
              return -1;
            }
            if (a.avarage_plate_price > b.avarage_plate_price) {
              return 1;
            }
            return 0;
          });
        } else if (filetype == "Open Now") {
          this.currentTime = moment().format("HH:mm");
          this.data.shop = this.data.shop.filter((a) => {
            a.open_time = moment("2019-07-19 " + a.open_time).format("HH:mm");
            a.close_time = moment("2019-07-19 " + a.close_time).format("HH:mm");
            if (
              this.currentTime >= a.open_time &&
              this.currentTime <= a.close_time
            ) {
              return a;
            }
          });
        } else {
          if (localStorage.getItem("isaddress") != "false") {
            this.api
              .getDataWithToken(
                "getAddress/" + localStorage.getItem("isaddress")
              )
              .subscribe((res: any) => {
                if (res.success) {
                  this.Address =
                    res.data.soc_name +
                    " " +
                    res.data.street +
                    " " +
                    res.data.city +
                    " " +
                    res.data.zipcode;

                  const options: NativeGeocoderOptions = {
                    useLocale: true,
                    maxResults: 5,
                  };

                  this.nativeGeocoder
                    .forwardGeocode(this.Address, options)
                    .then((result: NativeGeocoderResult[]) => {
                      this.data.shop.forEach((element) => {
                        element.distance = this.distance(
                          result[0].latitude,
                          result[0].longitude,
                          element.latitude,
                          element.longitude,
                          "K"
                        );
                      });

                      this.data.shop.sort((a, b) => {
                        if (a.distance < b.distance) {
                          return -1;
                        }
                        if (a.distance > b.distance) {
                          return 1;
                        }
                      });
                    })
                    .catch((error: any) => console.log(error));
                }
              });
          } else {
            const options: NativeGeocoderOptions = {
              useLocale: true,
              maxResults: 5,
            };

            this.nativeGeocoder
              .forwardGeocode(this.userAddress, options)
              .then((result: NativeGeocoderResult[]) => {
                this.data.shop.forEach((element) => {
                  element.distance = this.distance(
                    result[0].latitude,
                    result[0].longitude,
                    element.latitude,
                    element.longitude,
                    "K"
                  );
                });

                this.data.shop.sort((a, b) => {
                  if (a.distance < b.distance) {
                    return -1;
                  }
                  if (a.distance > b.distance) {
                    return 1;
                  }
                });
              })
              .catch((error: any) => console.log(error));
          }
        }
      }
    });
    return await modal.present();
  }

  detail() {
    this.navCtrl.navigateForward(["restaurant-detail"]);
  }

  resturantDetail(id) {
    this.api.detailId = id;
    this.navCtrl.navigateForward(["restaurant-detail"]);
  }

  distance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      const radlat1 = (Math.PI * lat1) / 180;
      const radlat2 = (Math.PI * lat2) / 180;
      const theta = lon1 - lon2;
      const radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  feature(type) {
    if (type) {
      this.api.filterType = type;
      console.log(this.api.filterType);
      this.navCtrl.navigateForward("/category");
    } else {
      this.navCtrl.navigateForward("/promocode/menu");
    }
  }

  categoryData(id) {
    console.log('this.id',id)
    this.navCtrl.navigateForward("/category/" + id);
  }
  getGrocery() {
    this.api.getDataWithToken("groceryShop").subscribe(
      (res: any) => {
        if (res.success) {
          this.grocery.Store = res.data.shop;
          this.grocery.coupon = res.data.coupon;
          this.api.getDataWithToken("groceryCategory").subscribe(
            (res: any) => {
              if (res.success) {
                this.util.dismissLoader();
                this.grocery.category = res.data;

                this.grocery.Store.forEach((element) => {
                  element.away = Number(
                    this.distance(
                      this.userAddress.lat,
                      this.userAddress.lang,
                      element.latitude,
                      element.longitude,
                      "K"
                    ).toFixed(2)
                  );
                });
              }
            },
            (err) => {
              this.util.dismissLoader();
              this.err = err;
            }
          );
          this.util.dismissLoader();
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err;
      }
    );
  }
  storeList() {
    this.navCtrl.navigateForward("store");
  }
  storeDetail(id) {
    this.gpi.storeID = id;
    this.navCtrl.navigateForward("/store-detail");
  }
  subcategory(id) {
    this.gpi.catId = id;
    this.navCtrl.navigateForward("store");
  }
  getCategory() {
    this.navCtrl.navigateForward("/grocery-category");
  }
  handleAddressView(){
    if(this.addressList.length>0){
    this.isAddressListVisible = !this.isAddressListVisible;
  }
  }

}
