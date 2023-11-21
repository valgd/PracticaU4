import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Cart, Product, CartItem } from '../models/product.model';
import { AlertController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public cart: Cart;

  constructor(private cartService: CartService, private alertController: AlertController,
    private toastController: ToastController) {
    this.cart = this.cartService.getCart();
  }

  async hacerCompra(){
    this.cartService.buyProducts(this.cart)
    .then(async (result)=>{
          if(result=='success'){
            console.log('Producto guardado exitosamente');
            const toast = await this.toastController.create({
              message: 'Producto guardado correctamente',
              duration: 2000, // Duración de 2 segundos
              position: 'top' // Posición superior
            });
            toast.present();
          }else{
            console.log('Error al guardar el producto');
          }
        })
        .catch(error =>{
          console.log('error')
        });
  }

  async promptRemoveItem(item: CartItem) {
    const alert = await this.alertController.create({
      header: 'Eliminar Producto',
      message: `¿Cuántos ${item.product.name} deseas eliminar?`,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          max: item.quantity,
          value: '1', // Valor predeterminado
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: (data) => {
            const quantityToRemove = parseInt(data.quantity, 10);
            if (quantityToRemove > 0) {
              this.cartService.removeItemFromCart(item, quantityToRemove);
            }
          },
        },
      ],
    });
  
    await alert.present();
  }

}
