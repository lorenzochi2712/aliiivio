import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {HomePage} from '../home.page'

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss']
})
export class TestPage {
  testIniciado = false;
  testFinalizado = false;
  seccionActual = 1;
  preguntaIndex = 0;
  resultado = 0;
  mostrarResultado = false;
  puntajeTotal = 0;
  gifResultado = '';
  txtResultado = '';
// Aquí deberías colocar las rutas correctas de los 3 gifs cargados
  gifVerde = 'assets/gifs/resultado-verde.gif'; // Puntaje bajo
  gifAmarillo = 'assets/gifs/resultado-amarillo.gif'; // Puntaje medio
  gifRojo = 'assets/gifs/resultado-rojo.gif'; // Puntaje alto

  preguntasUno: string[] = [
    '¿En estas semanas recientes has tenido problemas para dormir, como dormir mucho, poco, tener pesadillas o terrores nocturnos?',
    '¿De repente te llegan pensamientos y/o sentimientos feos, desagradables de algún suceso que pudo haberte dejado un trauma?',
    '¿Consumes o has consumido cigarrillos, alcohol o drogas ilegales?',
    '¿Frecuentemente escuchas voces o diálogos dentro de tu cabeza?',
    '¿Has sufrido alguna pérdida importante de algún familiar, escuela, amistad o mascota, y es difícil superarlo?',
    '¿Has tenido o tienes pensamientos de muerte e ideación suicida?',
    '¿Tienes problemas cardiacos como presión alta o baja?',
    '¿Has tenido, tienes o has visto situaciones de cualquier tipo de violencia dentro o fuera de tu familia?'
  ];

  preguntasDos: string[] = [
    'Me siento tensa/o, nerviosa/o:',
    'Sigo disfrutando de las cosas como siempre:',
    'Siento una especie de temor como si algo malo fuera a suceder:',
    'Soy capaz de reírme y ver el lado gracioso de las cosas:',
    'Tengo la cabeza llena de preocupaciones:',
    'Me siento alegre:',
    'Soy capaz de permanecer sentada/o, tranquila/o:',
    'Me siento lenta/o y torpe:',
    'Siento una desagradable sensación de nervios y hormigueos en el estómago:',
    'He perdido el interés por mi aspecto personal:',
    'Me siento inquieta/o como si no pudiera parar de moverme:',
    'Espero las cosas con ilusión:',
    'Siento de repente sensaciones de gran angustia o temor:',
    'Soy capaz de disfrutar con un buen libro, un tesito, un cafesito, una película, algo de música, una distracción saludable:'
  ];

  respuestasUno: number[] = Array(this.preguntasUno.length).fill(null);
  respuestasDos: number[] = Array(this.preguntasDos.length).fill(null);

  playlist: any[] =[];

  constructor(private router: Router) {
  }
  ngOnInit(){
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { playlist: any[] };

    if (!state?.playlist || state.playlist.length === 0) {
      console.warn('No playlist found in state.');
      return;
    }

    this.playlist = state.playlist;
  }

  iniciarTest() {
    this.testIniciado = true;
  }


  obtenerPreguntaActual(): string {
    if (this.seccionActual === 1) {
      return this.preguntasUno[this.preguntaIndex];
    } else {
      return this.preguntasDos[this.preguntaIndex - this.preguntasUno.length];
    }
  }

  responderSiNo(valor: number) {
    this.respuestasUno[this.preguntaIndex] = valor;
  }

  responderMultiple(valor: number) {
    const index = this.preguntaIndex - this.preguntasUno.length;
    this.respuestasDos[index] = valor;
  }
  esPreguntaInvertida(): boolean {
    const index = this.preguntaIndex - this.preguntasUno.length;
    return [1, 3, 5, 7, 9, 11, 13].includes(index);
  }
  respuestaSeleccionada(): boolean {
    if (this.seccionActual === 1) {
      return this.respuestasUno[this.preguntaIndex] !== null;
    } else {
      return this.respuestasDos[this.preguntaIndex - this.preguntasUno.length] !== null;
    }
  }
  siguiente() {
    if (this.seccionActual === 1 && this.preguntaIndex < this.preguntasUno.length - 1) {
      this.preguntaIndex++;
    } else if (this.seccionActual === 1 && this.preguntaIndex === this.preguntasUno.length - 1) {
      this.seccionActual = 2;
      this.preguntaIndex++;
    } else if (this.seccionActual === 2 && this.preguntaIndex < this.preguntasUno.length + this.preguntasDos.length - 1) {
      this.preguntaIndex++;
    } else {
      this.calcularResultado();
      this.testFinalizado = true;
    }
  }

  anterior() {
    if (this.preguntaIndex > 0) {
      if (this.seccionActual === 2 && this.preguntaIndex === this.preguntasUno.length) {
        this.seccionActual = 1;
      }
      this.preguntaIndex--;
    }
  }

  esUltimaPregunta(): boolean {
    return this.preguntaIndex === this.preguntasUno.length + this.preguntasDos.length - 1;
  }

  calcularResultado() {
    const seccionUnoTotal = this.respuestasUno.reduce((acc, val) => acc + (val ?? 0), 0);
    const seccionDosTotal = this.respuestasDos.reduce((acc, val) => acc + (val ?? 0), 0);
    this.resultado = seccionUnoTotal + seccionDosTotal;
    this.mostrarResultados(this.resultado);
  }
  mostrarResultados(puntaje: number) {
    this.puntajeTotal = puntaje;
    this.mostrarResultado = true;

    if (puntaje < 15) {
      this.txtResultado= 'Parece que en este momento te sientes bastante tranquilo(a). Es normal tener preocupaciones de vez en cuando, pero en general, estás manejando bien tus emociones. ¡Sigue cuidándote!'
      this.gifResultado = this.gifVerde;
    } else if (puntaje < 25) {
      this.txtResultado='Has mostrado algunas señales de preocupación o nerviosismo. No es algo grave, pero puede ser útil que tomes descansos, hables con alguien de confianza o hagas actividades que te relajen.'
      this.gifResultado = this.gifAmarillo;
    } else {
      this.txtResultado='Parece que últimamente has estado sintiéndote con mucho estrés, ansiedad o tristeza. No estás solo(a). Hablar con un adulto, amigo o especialista puede ayudarte a sentirte mejor poco a poco'
      this.gifResultado = this.gifRojo;
    }
    if(this.mostrarResultado){
      setTimeout(()=> {
        this.irAEntrenamiento();
      },7700)
    }
  }

  irAEntrenamiento() {
    this.router.navigate(['/audio-playerent'], {
      state: { playlist: this.playlist }
    });
  }
  
}
