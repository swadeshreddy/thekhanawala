import { NavController, Platform } from "@ionic/angular";
import { UtilService } from "./../../service/util.service";
import { ApiService } from "./../../service/api.service";
import { Component, OnInit } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ActivatedRoute } from "@angular/router";
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { GroceryService } from 'src/app/service/grocery.service';
declare var google;

@Component({
  selector: "app-category",
  templateUrl: "./category.page.html",
  styleUrls: ["./category.page.scss"]
})
export class CategoryPage implements OnInit {
  data: any = [];
  err: any = {};
  currency: any;
  Address: any;
  btnType = "Exclusive";
  isfrom: any;
  geocoder = new google.maps.Geocoder();
  userAddress: any = {};
  constructor(
    private api: ApiService,
    private util: UtilService,
    private geolocation: Geolocation,
    private ntrl: NavController,
    private route: ActivatedRoute,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private nativeGeocoder: NativeGeocoder,
    private gpi: GroceryService,
  ) {
    this.currency = this.api.currency;

    this.route.params.subscribe(params => {
      this.isfrom = params["id"];
      if (this.isfrom) {
        // //this.util.startLoad();
        this.api
          .getDataWithToken("categoryShop/" + this.isfrom)
          .subscribe((res: any) => {
            if (res.success) {
             // this.util.dismissLoader();
              this.data = res.data;
            }
          });
      } else {

        // //this.util.startLoad();
        this.api.getDataWithToken("shops").subscribe(
          (res: any) => {
            if (res.success) {
              this.data = res.data;
              if (this.api.filterType == "popular") {
               // this.util.dismissLoader();
                this.data.sort((a, b) => {
                  if (a.rate > b.rate) {
                    return -1;
                  }
                  if (a.rate < b.rate) {
                    return 1;
                  }
                  return 0;
                });
              } else if (this.api.filterType == "pureveg") {
               // this.util.dismissLoader();
                this.data = this.data.filter(a => {
                  if (a.veg > 0) {
                    return a;
                  }
                });
              } else if (this.api.filterType == "lowcost") {
               // this.util.dismissLoader();
                this.data.sort((a, b) => {
                  if (a.avarage_plate_price < b.avarage_plate_price) {
                    return -1;
                  }
                  if (a.avarage_plate_price > b.avarage_plate_price) {
                    return 1;
                  }
                  return 0;
                });
              }
              else {
               // this.util.dismissLoader();
                if (localStorage.getItem("isaddress") != "false") {
                  this.api
                    .getDataWithToken(
                      "getAddress/" + localStorage.getItem("isaddress")
                    )
                    .subscribe((res: any) => {
                      if (res.success) {
                        this.data.forEach(element => {
                          element.distance = this.distance(
                            res.data.lat,
                            res.data.lang,
                            element.latitude,
                            element.longitude,
                            "K"
                          );
                        });
                        this.data.sort((a, b) => {
                          if (a.distance < b.distance) {
                            return -1;
                          }
                          if (a.distance > b.distance) {
                            return 1;
                          }
                        });
                      }
                    });
                } else {
                  this.geolocation
                    .getCurrentPosition()
                    .then(resp => {
                      resp.coords.latitude;
                      resp.coords.longitude;
                      this.data.forEach(element => {
                        element.distance = this.distance(
                          resp.coords.latitude,
                          resp.coords.longitude,
                          element.latitude,
                          element.longitude,
                          "K"
                        );
                      });
                      this.data.sort((a, b) => {
                        if (a.distance < b.distance) {
                          return -1;
                        }
                        if (a.distance > b.distance) {
                          return 1;
                        }
                      });
                    })
                    .catch(error => {

                    });
                }
              }
            }
          },
          err => {
            this.err = err.error;
          }
        );
      }
    });
  }

  /*   ionViewWillEnter(){
      if (localStorage.getItem("isaddress") != "false") {
        //this.util.startLoad();
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
          this.androidPermissions
            .checkPermission(
              this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
            )
            .then((result) => {
              if (result.hasPermission) {
                // //this.util.startLoad();
                this.geolocation
                  .getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 5000,
                  })
                  .then((resp) => {
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
                        this.userAddress.address_type = "Current Location";
                        this.userAddress.soc_name = result[0].subLocality;
                        this.userAddress.street = result[0].thoroughfare;
                        this.userAddress.city = result[0].locality;
                        this.userAddress.zipcode = result[0].postalCode;
                      })
                      .catch((error: any) => 
                  })
                  .catch((error) => {
                   // this.util.dismissLoader();
                  });
              } else {
                this.androidPermissions.requestPermission(
                  this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
                );
              }
            });
        } else {
          // this.getData();
        }
      }
    } */

  ngOnInit() { }
  distance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      let radlat1 = (Math.PI * lat1) / 180;
      let radlat2 = (Math.PI * lat2) / 180;
      let theta = lon1 - lon2;
      let radtheta = (Math.PI * theta) / 180;
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
  resturantDetail(id) {
    this.api.detailId = id;
    this.ntrl.navigateForward("/restaurant-detail");
  }
}
