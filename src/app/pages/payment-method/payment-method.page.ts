import { Stripe } from "@ionic-native/stripe/ngx";
import { UtilService } from "./../../service/util.service";
import { ApiService } from "./../../service/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController, ModalController } from "@ionic/angular";
import { SuccessModalPage } from "../success-modal/success-modal.page";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration,
} from "@ionic-native/paypal/ngx";
import { TranslateService } from "@ngx-translate/core";

declare var RazorpayCheckout: any;
@Component({
  selector: "app-payment-method",
  templateUrl: "./payment-method.page.html",
  styleUrls: ["./payment-method.page.scss"],
})
export class PaymentMethodPage implements OnInit {
  err: any;
  razor_key: any;
  data: any = {
    itemData: [],
    items: [],
    package_id: [],
  };
  online = 1;
  cash = 0;
  payment_type: any = "LOCAL";
  paypalProductionkey: any;
  paypalSanboxkey: any;
  paypalPayment = 0;
  apdata: any = {};
  razorPayment = 1;
  currencyType: any;
  cardData: any = {};
  public stripeForm: FormGroup;
  constructor(
    private ntrl: NavController,
    private modalController: ModalController,
    private api: ApiService,
    private util: UtilService,
    private payPal: PayPal,
    private stripe: Stripe,
    private translate: TranslateService,
    private formBuilder: FormBuilder
  ) {
    this.stripeForm = this.formBuilder.group({
      name: new FormControl("", Validators.compose([Validators.required])),
      number: new FormControl("", Validators.compose([Validators.required])),
      exmonth: new FormControl("", Validators.compose([Validators.required])),
      exyear: new FormControl("", Validators.compose([Validators.required])),
      cvv: new FormControl("", Validators.compose([Validators.required])),
    });
    this.currencyType = this.api.currencyType;
    // // // this.util.startLoad();
    this.api.getDataWithToken("keySetting").subscribe((res: any) => {
      if (res.success) {
        this.apdata = res.data;

        this.stripe.setPublishableKey(this.apdata.stripePublicKey);
        // //this.util.dismissLoader();
      }
    });
  }
  local: any = [];
  ngOnInit() { }
  paymentMethod() {
    this.data.items = [];
    this.data.package_id = [];
    this.data.itemData = []
    this.data.shopName = this.api.cartData.name;
    this.data.shop_id = localStorage.getItem('shopId');
    this.data.payment = localStorage.getItem('toPay');
    this.data.discount = this.api.cartData.discount;
    this.data.shop_charge = localStorage.getItem('restoCharge');
    this.data.delivery_charge = localStorage.getItem('delCharge');
    this.data.coupon_price = this.api.cartData.discount;
    if (this.api.promocode == undefined) {
    } else {
      this.data.coupon_id = this.api.promocode.id;
    }

    if (typeof this.data.items == "string") {
      this.data.items = [];
      this.data.package_id = [];
    }
    this.local = JSON.parse(localStorage.getItem('cart-detail'))
    this.local.forEach((element) => {
      if (element.type == "combo") {
        this.data.package_id.push(element.id);
        let pusher: any = {
          item: "",
          price: element.total,
          quantity: element.qty,
          package_id: element.id,
        };
        this.data.itemData.push(pusher);
      } else {
        this.data.items.push(element.id);
        let pusher: any = {
          item: element.id,
          price: element.total,
          quantity: element.qty,
          package_id: "",
        };
        this.data.itemData.push(pusher);
      }
    });
    this.data.items = this.data.items.join();
    this.data.package_id = this.data.package_id.join();

    if (this.online) {
      localStorage.setItem("payment_type", "online");
      if (this.payment_type == "RAZOR") {
        this.payWithRazor();
      } else if (this.payment_type == "STRIPE") {
        this.stripePayment();
      } else {
        if (this.currencyType == "INR") {
          this.translate.get("toasts").subscribe(async (val) => {
            this.util.presentToast(val.payment_not_possible);
          });
        } else {
          this.paypalPay();
        }
      }
    } else {
      localStorage.setItem("payment_type", "cash");

      this.data.payment_status = 0;
      this.data.payment_type = "LOCAL";

      // this.util.startLoad();
      this.api.postDataWithToken("createOrder", this.data).subscribe(
        (res: any) => {
          if (res.success) {
            this.api.promocode = {};
            //this.util.dismissLoader();
            this.api.checkOrderStatus = res.data.id;
            this.presentModal();
          }
        },
        (err) => {
          this.err = err.error.errors;
          //this.util.dismissLoader();
        }
      );
    }
  }
  back() {
    this.ntrl.back();
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: SuccessModalPage,
      backdropDismiss: false,
      cssClass: "SuccessModal",
    });
    localStorage.removeItem('restoCharge');
    localStorage.removeItem('delCharge');
    localStorage.removeItem('cart-detail');
    localStorage.removeItem('toPay');
    localStorage.removeItem('radius');
    localStorage.removeItem('shopId');
    return await modal.present();

  }
  payWithRazor() {
    var options = {
      description: "Credits towards consultation",
      image: "http://placehold.it/96x96.png",
      currency: this.currencyType,
      key: this.apdata.razorPublishKey,
      amount: this.data.payment * 100,
      name: "irest",
      prefill: {
        email: "admin@enappd.com",
        contact: "9621323231",
        name: "Enappd",
      },
      theme: {
        color: "#94b92d",
      },
      modal: {
        ondismiss: function () {
          alert("dismissed");
        },
      },
    };

    var successCallback = (payment_id) => {
      this.data.payment_token = payment_id;

      this.data.payment_status = 1;
      this.data.payment_type = "RAZOR";
      // // this.util.startLoad();
      this.api.postDataWithToken("createOrder", this.data).subscribe(
        (res: any) => {
          if (res.success) {
            this.api.promocode = {};
            //this.util.dismissLoader();
            this.api.checkOrderStatus = res.data.id;
            this.presentModal();
          }
        },
        (err) => {
          this.err = err.error.errors;
          //this.util.dismissLoader();
        }
      );
    };

    var cancelCallback = function (error) {
      alert(error.description + " (Error " + error.code + ")");
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }
  paypalPay() {
    this.payPal

      .init({
        PayPalEnvironmentProduction: this.apdata.paypalProduction,
        PayPalEnvironmentSandbox: this.apdata.paypalSendbox,
      })

      .then(
        () => {
          this.payPal
            .prepareToRender(
              "PayPalEnvironmentSandbox",
              new PayPalConfiguration({})
            )
            .then(
              () => {
                let payment = new PayPalPayment(
                  this.data.payment,
                  this.currencyType,
                  "Description",
                  "sale"
                );
                this.payPal.renderSinglePaymentUI(payment).then(
                  (result) => {
                    this.data.payment_token = result.response.id;
                    this.data.payment_status = 1;
                    this.data.payment_type = "PAYPAL";
                    // // this.util.startLoad();
                    this.api
                      .postDataWithToken("createOrder", this.data)
                      .subscribe(
                        (res: any) => {
                          if (res.success) {
                            this.api.promocode = {};
                            //this.util.dismissLoader();
                            this.api.checkOrderStatus = res.data.id;
                            this.presentModal();
                          }
                        },
                        (err) => {
                          this.err = err.error.errors;
                          //this.util.dismissLoader();
                        }
                      );
                  },
                  (e) => {
                    console.log(e);
                  }
                );
              },
              (e) => {
                console.log(e);
              }
            );
        },
        (e) => {
          console.log(e);
        }
      );
  }
  stripePayment() {
    // // this.util.startLoad();
    this.stripe
      .createCardToken(this.cardData)
      .then((token) => {
        this.data.payment_token = token.id;
        this.data.payment_status = 1;
        this.data.payment_type = "STRIPE";
        this.api.postDataWithToken("createOrder", this.data).subscribe(
          (res: any) => {
            if (res.success) {
              //this.util.dismissLoader();
              this.api.promocode = {};
              this.api.checkOrderStatus = res.data.id;
              this.presentModal();
            }
          },
          (err) => {
            this.err = err.error.errors;
            //this.util.dismissLoader();
          }
        );
      })
      .catch((error) => console.error(error));
  }
}
