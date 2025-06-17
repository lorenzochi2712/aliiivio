import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import { IonIcon } from '@ionic/angular/standalone';
import { chevronBackOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.page.html',
  styleUrls: ['./reproductor.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,NgIf,
    IonButtons,
    IonBackButton,
  ]
})
export class ReproductorPage implements OnInit {
  currentAudio: any = null;
  loading: boolean = true;
  audioElement = new Audio();
  isPlaying = false; // 👈 Estado del audio

  constructor(private route: ActivatedRoute) {
    addIcons({chevronBackOutline});
  }

  ngOnInit() {
    // Escuchar eventos del audio
    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
    });
    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
    });

    this.route.queryParams.subscribe(params => {
      if (params['img'] && params['titulo'] && params['audio']) {
        this.currentAudio = {
          img: params['img'],
          titulo: params['titulo'],
          audio: params['audio']
        };

        if (this.audioElement.src !== this.currentAudio.audio) {
          this.audioElement.src = this.currentAudio.audio;
          this.audioElement.load();
        }

        // Verifica si ya se está reproduciendo
        this.isPlaying = !this.audioElement.paused;
      }

      this.loading = false;
    });
  }

  playPauseAudio() {
    if (this.audioElement.paused) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  }
    // 🔴 Este método se llama automáticamente al salir de la página
  ionViewWillLeave() {
    if (!this.audioElement.paused) {
      this.audioElement.pause();
    }
  }
}