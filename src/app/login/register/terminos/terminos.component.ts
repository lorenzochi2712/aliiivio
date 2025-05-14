import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terminos',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Términos y Condiciones</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <p>
        Aquí van los términos y condiciones completos del servicio.
        Puedes personalizarlos con tu propio contenido legal o de uso.
      </p>
    </ion-content>
  `
})
export class TerminosComponent {
  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }
}

