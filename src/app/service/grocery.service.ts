import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GroceryService {
  storeID: any;
  catId: any;
  itemId: any;
  orderId: any;
  cartData: any = [];
  promocode: any;
  current: any = {};
  info: any;
  constructor() {}
}
