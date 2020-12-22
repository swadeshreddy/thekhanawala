import { element } from "protractor";
import { UtilService } from "./../../service/util.service";
import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ApiService } from "./../../service/api.service";
import {
  NativeGeocoder,
  NativeGeocoderOptions,
  NativeGeocoderResult,
} from "@ionic-native/native-geocoder/ngx";
import { type } from "os";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { TranslateService } from "@ngx-translate/core";
declare var google;
@Component({
  selector: "app-add-address",
  templateUrl: "./add-address.page.html",
  styleUrls: ["./add-address.page.scss"],
})
export class AddAddressPage implements OnInit {
  addressData: any = {};
  isEdit: boolean = false;
  err: any = {};
  ischange = false;
  addressType: any = [
    { name: "Home", checked: true },
    { name: "Office", checked: false },
    { name: "Other", checked: false },
  ];
  geocoder = new google.maps.Geocoder();
  Centerlat = 22.308155;
  Centerlng = 70.800705;
  public agmMap: any = {
    lat: "",
    lng: "",
  };
  map: any;
  TCenterlat: any;
  TCenterlng: any;
  constructor(
    private modalController: ModalController,
    private api: ApiService,
    private util: UtilService,
    private geolocation: Geolocation,
    private translate: TranslateService
  ) {
    this.geolocation.getCurrentPosition().then(
      (res: any) => {
        this.agmMap.lat = res.coords.latitude;
        this.agmMap.lng = res.coords.longitude;
        this.TCenterlat = res.coords.latitude;
        this.TCenterlng = res.coords.longitude
        this.getFormattedAddress()
      },
      () => {}
    );

    if (this.api.parseData && this.api.parseData.action) {
      this.isEdit = true;
      this.addressData = this.api.parseData;

      this.Centerlat = parseFloat(this.addressData.lat);
      this.Centerlng = parseFloat(this.addressData.lang);
      this.TCenterlat = parseFloat(this.addressData.lat);
      this.TCenterlng = parseFloat(this.addressData.lang);

      this.addressType.forEach((element) => {
        if (this.addressData.address_type === element.name) {
          element.checked = true;
        } else {
          element.checked = false;
        }
      });
    } else {
      this.geolocation.getCurrentPosition().then(
        (res: any) => {
          this.TCenterlat = res.coords.latitude;
          this.TCenterlng = res.coords.longitude;
        },
        () => {}
      );
    }
  }

  ngOnInit() {}
  setAddressType(type) {
    this.addressType.forEach((element) => {
      element.checked = false;
    });
    type.checked = true;
  }
  closeModal() {
    this.isEdit = false;
    this.api.parseData = {};
    this.modalController.dismiss();
  }
  saveAddress() {
    if (this.isEdit == true) {
      this.addressType.forEach((element) => {
        if (element.checked) {
          this.addressData.address_type = element.name;
        }
      });
      this.addressData.address_id = this.addressData.id;

      this.util.startLoad();
      // this.TCenterlat = 55.7522;
      // this.TCenterlng = 37.53568;
      this.addressData.lat = this.TCenterlat;
      this.addressData.lang = this.TCenterlng;
      this.api
        .postDataWithToken("editAddress", this.addressData)

        .subscribe(
          (res: any) => {
            if (res.success) {
              this.util.dismissLoader();
              this.translate.get("toasts").subscribe(async (val) => {
                this.util.presentToast(val.address_update);
              });
              this.api.parseData = {};
              this.ischange == true;
              this.modalController.dismiss(this.ischange);
            }
          },
          (err) => {
            this.util.dismissLoader();
            this.err = err.error.errors;
          }
        );
    } else {
      this.addressType.forEach((element) => {
        if (element.checked) {
          this.addressData.address_type = element.name;
        }
      });
      this.util.startLoad();

      this.addressData.lat = this.TCenterlat;
      this.addressData.lang = this.TCenterlng;

      this.api.postDataWithToken("addAddress", this.addressData).subscribe(
        (res: any) => {
          if (res.success) {
            this.util.dismissLoader();
            if (localStorage.getItem("isaddress") == "false") {
              localStorage.setItem("isaddress", res.data.id);
            }
            this.isEdit = false;
            this.api.parseData = {};
            this.ischange = true;
            this.modalController.dismiss(this.ischange);
          }
        },
        (err) => {
          this.util.dismissLoader();
          this.err = err.error.errors;
        }
      );
    }
  }
  getFormattedAddress()
  {
    if(this.TCenterlat != NaN){
     this.getGeoLocation(this.TCenterlat,this.TCenterlng).then((data:any)=>{
      this.addressData.city= data['city'];
      this.addressData.zipcode=data['zipcode'];
      this.addressData.street=data['street']
   
      }).catch((err)=>{console.log(err)})
    }
  }
  centerChange($event) {
    this.TCenterlat = $event.coords.lat;
    this.TCenterlng = $event.coords.lng;
    this.getFormattedAddress()
  }
  getGeoLocation(lat: number, lng: number) {
    var address:any={}
    return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        console.log(latlng.lat())
        let request = {
            latLng: latlng
        };
        // console.log(request)
        geocoder.geocode(request, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              for (var i = 0; i < results[0].address_components.length; i++) {
                  var types = results[0].address_components[i].types;
                  for (var typeIdx = 0; typeIdx < types.length; typeIdx++) {
                      if (types[typeIdx] == 'postal_code') {
                          //console.log(results[0].address_components[i].long_name);
                          // console.log(results[0].address_components[i].short_name);
                          address.zipcode =  results[0].address_components[i].short_name
                      }
                      if (types[typeIdx] == "locality") {
                        //console.log(results[0].address_components[i].long_name);
                        // console.log(results[0].address_components[i].short_name);
                        address.city =  results[0].address_components[i].short_name
                    }
                    if (types[typeIdx] == "sublocality") {
                      //console.log(results[0].address_components[i].long_name);
                      if(address.street == undefined){
                        address.street = results[0].address_components[i].short_name;
                      }else{
                        address.street = address.street.concat(" ",results[0].address_components[i].short_name);
                      }
                     
                      // console.log(results[0].address_components[i].short_name);
                  }
                  
                  }
              }
              address.address = results[0].formatted_address
              resolve(address)
          } else {
              console.log("No results found");
          }
            if (results[1]) {
             //formatted address
            //  alert(results[0].formatted_address)
            //find country name
              // resolve(results[0].formatted_address)
            } else {
              console.log("No results found");
            }
          } else {
            console.log("Geocoder failed due to: " + status);
          }
        });
    }
  })
}
}
