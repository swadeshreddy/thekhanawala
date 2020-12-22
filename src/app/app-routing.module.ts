import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "./service/auth-guard-service.service";
const routes: Routes = [
 {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: "login", loadChildren: "./pages/login/login.module#LoginPageModule" },
  {
    path: "signup",
    loadChildren: "./pages/signup/signup.module#SignupPageModule",
  },
  {
    path: "verify",
    loadChildren: "./pages/verify/verify.module#VerifyPageModule",
  },
  {
    path: "get-otp",
    loadChildren: "./pages/get-otp/get-otp.module#GetOtpPageModule",
  },
  { path: "slide", loadChildren: "./pages/slide/slide.module#SlidePageModule" },
  {
    path: "cart",
    loadChildren: "./pages/cart/cart.module#CartPageModule",
    canActivate: [AuthGuardService],
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: "payment-method",
    loadChildren:
      "./pages/payment-method/payment-method.module#PaymentMethodPageModule",
    canActivate: [AuthGuardService],
  },
  {
    path: "add-card",
    loadChildren: "./pages/add-card/add-card.module#AddCardPageModule",
  },
  {
    path: "success-modal",
    loadChildren:
      "./pages/success-modal/success-modal.module#SuccessModalPageModule",
  },
  {
    path: "payment",
    loadChildren: "./pages/payment/payment.module#PaymentPageModule",
  },
  {
    path: "order-history",
    loadChildren:
      "./pages/order-history/order-history.module#OrderHistoryPageModule",
    canActivate: [AuthGuardService],
  },
  {
    path: "order-detail",
    loadChildren:
      "./pages/order-detail/order-detail.module#OrderDetailPageModule",
  },
  {
    path: "restaurant-detail",
    loadChildren:
      "./pages/restaurant-detail/restaurant-detail.module#RestaurantDetailPageModule",
  },
  {
    path: "promocode/:id",
    loadChildren: "./pages/promocode/promocode.module#PromocodePageModule",
  },
  {
    path: "notification",
    loadChildren:
      "./pages/notification/notification.module#NotificationPageModule",
    canActivate: [AuthGuardService],
  },
  {
    path: "invite-friends",
    loadChildren:
      "./pages/invite-friends/invite-friends.module#InviteFriendsPageModule",
    canActivate: [AuthGuardService],
  },
  {
    path: "help-center",
    loadChildren: "./pages/help-center/help-center.module#HelpCenterPageModule",
  },
  {
    path: "filter",
    loadChildren: "./pages/filter/filter.module#FilterPageModule",
  },
  {
    path: "profile",
    loadChildren: "./pages/profile/profile.module#ProfilePageModule",
    canActivate: [AuthGuardService],
  },
  {
    path: "profile/:id",
    loadChildren: "./pages/profile/profile.module#ProfilePageModule",
    canActivate: [AuthGuardService],
  },
  {
    path: "timeline",
    loadChildren: "./pages/timeline/timeline.module#TimelinePageModule",
    canActivate: [AuthGuardService],
  },

  {
    path: "popover",
    loadChildren: "./pages/popover/popover.module#PopoverPageModule",
  },
  {
    path: "review",
    loadChildren: "./pages/review/review.module#ReviewPageModule",
  },
  {
    path: "forgot",
    loadChildren: "./pages/forgot/forgot.module#ForgotPageModule",
  },
  {
    path: "item-review",
    loadChildren: "./pages/item-review/item-review.module#ItemReviewPageModule",
  },
  {
    path: "add-address",
    loadChildren: "./pages/add-address/add-address.module#AddAddressPageModule",
  },
  {
    path: "select-address",
    loadChildren:
      "./pages/select-address/select-address.module#SelectAddressPageModule",
  },
  {
    path: "category/:id",
    loadChildren: "./pages/category/category.module#CategoryPageModule",
  },
  {
    path: "category",
    loadChildren: "./pages/category/category.module#CategoryPageModule",
  },
  {
    path: "grocery-home",
    loadChildren:
      "./pages/grocery-home/grocery-home.module#GroceryHomePageModule",
  },
  { path: "store", loadChildren: "./pages/store/store.module#StorePageModule" },
  {
    path: "store-detail",
    loadChildren:
      "./pages/store-detail/store-detail.module#StoreDetailPageModule",
  },
  {
    path: "product",
    loadChildren: "./pages/product/product.module#ProductPageModule",
  },
  {
    path: "grocery-category",
    loadChildren:
      "./pages/grocery-category/grocery-category.module#GroceryCategoryPageModule",
  },
  {
    path: "category-detail",
    loadChildren:
      "./pages/category-detail/category-detail.module#CategoryDetailPageModule",
  },
  {
    path: "product-detail",
    loadChildren:
      "./pages/product-detail/product-detail.module#ProductDetailPageModule",
  },
  {
    path: "product-filter",
    loadChildren:
      "./pages/product-filter/product-filter.module#ProductFilterPageModule",
  },
  {
    path: "grocery-cart",
    loadChildren:
      "./pages/grocery-cart/grocery-cart.module#GroceryCartPageModule",
    canActivate: [AuthGuardService],
  },
  {
    path: "pay-method",
    loadChildren: "./pages/pay-method/pay-method.module#PayMethodPageModule",
    canActivate: [AuthGuardService],
  },
  {
    path: "grocery-status",
    loadChildren:
      "./pages/grocery-status/grocery-status.module#GroceryStatusPageModule",
  },
  {
    path: "grocery-history",
    loadChildren:
      "./pages/grocery-history/grocery-history.module#GroceryHistoryPageModule",
    canActivate: [AuthGuardService],
  },
  {
    path: "grocery-order-detail",
    loadChildren:
      "./pages/grocery-order-detail/grocery-order-detail.module#GroceryOrderDetailPageModule",
  },
  {
    path: "grocery-success",
    loadChildren:
      "./pages/grocery-success/grocery-success.module#GrocerySuccessPageModule",
  },
  {
    path: "grocery-promocode",
    loadChildren:
      "./pages/grocery-promocode/grocery-promocode.module#GroceryPromocodePageModule",
  },
  { path: 'restuarent-list', loadChildren: './pages/restuarent-list/restuarent-list.module#RestuarentListPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
    /*   { path: 'otpmodalpage', loadChildren: './pages/otpmodalpage/otpmodalpage.module#OtpmodalpagePageModule' }, */
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
