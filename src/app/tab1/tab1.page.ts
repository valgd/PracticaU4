import { Component } from '@angular/core';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public products: Product[] = [];
  public productsFounds: Product[] = [];
  public filter = [
    "Abarrotes",
    "Frutas y Verduras",
    "Limpieza",
    "Farmacia",
  ];

  public colors = [
    {
      type: "Abarrotes",
      color: "primary"
    },
    {
      type: "Frutas y Verduras",
      color: "secondary"
    },
    {
      type: "Limpieza",
      color: "warning"
    },
    {
      type: "Farmacia",
      color: "danger"
    }
  ];

  constructor(private cartService: CartService, private router: Router, private productService: ProductService, private authService: AuthService,
    private alertController: AlertController) {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.productsFounds = this.products;
    });

  }

  public getColor(type: string): string {
    const itemFound = this.colors.find((element) => {
      return element.type === type;
    });
    let color = itemFound && itemFound.color ? itemFound.color : "";
    return color;
  }

  public filterProducts(): void {
    console.log(this.filter);
    this.productsFounds = this.products.filter(
      item => {
        return this.filter.includes(item.type);
      }
    );
  }

  public addToCart(product: Product, i: number) {
    product.photo = product.photo + i;
    this.cartService.addToCart(product);
    console.log(this.cartService.getCart());
  }

  openProductAddPage() {
    this.router.navigate(['/add-product']); // Asume que la ruta 'product-add' existe para añadir productos.
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openProductUpdatePage(name:string) {
    this.productService.pos = this.products.findIndex(item => item.name == name);
    this.productService.productwhere = this.products[this.productService.pos];
    this.productService.productCollection.snapshotChanges().subscribe((data) => {
      this.productService.productwhere.id = data[this.productService.pos].payload.doc.id;
    });
    console.log(this.productService.productwhere);
    
    
    this.router.navigate(['/update-product']);
    
  }

  async mostrarConfirmacion(name:string) {

    this.productService.pos = this.products.findIndex(item => item.name == name);
    this.productService.productwhere = this.products[this.productService.pos];
    this.productService.productCollection.snapshotChanges().subscribe((data) => {
      this.productService.productwhere.id = data[this.productService.pos].payload.doc.id;
    });

  const alert = await this.alertController.create({
    header: 'Alerta',
    message: '¿Quieres eliminar el producto seleccionado?',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Acción cancelada');
        }
      }, {
        text: 'Sí',
        handler: () => {
          this.productService.deleteProduct(this.productService.productwhere);
        }
      }
    ]
  });

  await alert.present();
}
  

}
