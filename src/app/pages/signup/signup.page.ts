import { UtilService } from "./../../service/util.service";
import { ApiService } from "./../../service/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController, MenuController, Platform } from "@ionic/angular";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  data: any = {};
  err: any = {};
  innerWidth=300
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  constructor(
    private ntrl: NavController,
    private menu: MenuController,
    private api: ApiService,
    private util: UtilService,
    private platform:Platform
  ) {
    this.menu.enable(false);
    this.platform.ready().then(()=>{
      this.innerWidth=this.platform.width()
    })
  }

  ngOnInit() {}
  signUp() {
    this.ntrl.navigateRoot(["login"]);
  }
  gotologin() {
    this.util.startLoad();
    this.api.postData("register", this.data).subscribe(
      (res: any) => {
        if (res.success) {
          if (res.data.address_id) {
            localStorage.setItem("isaddress", res.data.address_id);
          } else {
            localStorage.setItem("isaddress", "false");
          }
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            this.api.userToken = res.data.token;
            this.util.isUpdateProfile.next(true);
            this.ntrl.navigateRoot("/slide");
          } else {
            this.api.verifyId = res.data.id;
            this.ntrl.navigateForward("verify");
          }
        }
        this.util.dismissLoader();
        this.err = {};
        this.util.presentToast(res.msg);
      },
      (err) => {
        this.err = err.error.errors;
        this.util.dismissLoader();
      }
    );
  }
}
