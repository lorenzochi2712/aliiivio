import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-test',
  standalone: true,
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TestPage {
  preguntas = [
    '¿En estas semanas recientes has tenido problemas para dormir, como dormir mucho, poco, tener pesadillas o terrores nocturnos?',
    '¿De repente te llegan pensamientos y/o sentimientos feos, desagradables de algún suceso que pudo haberte dejado un trauma?',
    '¿Consumes o has consumido cigarrillos, alcohol o drogas ilegales?',
    '¿Frecuentemente escuchas voces o diálogos dentro de tu cabeza?',
    '¿Has sufrido alguna pérdida importante de algún familiar, escuela, amistad o mascota, y es difícil superarlo?',
    '¿Has tenido o tienes pensamientos de muerte e ideación suicida?',
    '¿Tienes problemas cardiacos como presión alta o baja?',
    '¿Has tenido, tienes o has visto situaciones de cualquier tipo de violencia dentro o fuera de tu familia?'
  ];

  respuestas: string[] = new Array(this.preguntas.length).fill('');

  constructor(private alertCtrl: AlertController) {}

  responder(i: number, respuesta: string) {
    this.respuestas[i] = respuesta;

    const swiperEl: any = document.querySelector('swiper-container');
    if (swiperEl && i < this.preguntas.length - 1) {
      swiperEl.swiper.slideNext();
    }

    if (i === this.preguntas.length - 1) {
      this.enviarFormulario();
    }
  }

  async enviarFormulario() {
    const haySi = this.respuestas.includes('Sí');
    const mensaje = haySi
      ? 'Algunas respuestas indican que podrías beneficiarte hablando con un profesional. ❤️'
      : '¡Gracias por responder! Parece que todo va bien. 😊';

    const alert = await this.alertCtrl.create({
      header: 'Resultado',
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
  }
}
