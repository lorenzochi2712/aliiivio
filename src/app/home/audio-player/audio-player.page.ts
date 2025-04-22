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
  IonButton
} from '@ionic/angular/standalone';
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
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,NgIf
  ]
})
export class AudioPlayerPage implements OnInit {
  currentAudio: any = null;
  loading: boolean = true;
  audioElement = new Audio();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['img'] && params['titulo'] && params['audio']) {
        this.currentAudio = {
          img: params['img'],
          titulo: params['titulo'],
          audio: params['audio']
        };

        this.audioElement.src = this.currentAudio.audio;
        this.audioElement.load();
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  playPauseAudio() {
    if (this.audioElement.paused) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  }
}
