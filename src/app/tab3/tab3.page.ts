import { Component } from '@angular/core';
import { Cart } from '../models/product.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public cart: Observable<Cart[]>;

  constructor(private cartService:CartService) {

    this.cart =this.cartService.getCartHistorial()
    this.getHistorial();
  }

  public getHistorial(){
    return this.cart.forEach((result)=>{
      console.log(result.forEach(product=>{
        console.log(product.itemCount,product.total, product.items);
      }));
    });
  }
}