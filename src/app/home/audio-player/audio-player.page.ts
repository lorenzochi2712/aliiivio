import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
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
  IonButton,IonButtons,IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, settingsOutline } from 'ionicons/icons';
@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.page.html',
  styleUrls: ['./audio-player.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonButton,NgIf,
    IonButtons,IonBackButton
  ]
})
export class AudioPlayerPage implements OnInit {
  currentAudio: any = null;
  loading: boolean = true;
  audioElement = new Audio();
  isPlaying = false; // 👈 Estado del audio

  constructor(private route: ActivatedRoute) {
    addIcons({ settingsOutline, arrowBackOutline });
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