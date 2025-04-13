import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  templateUrl: './audio-player.page.html',
  styleUrls: ['./audio-player.page.scss'],
  imports: [IonicModule, CommonModule]
})
export class AudioPlayerPage implements OnInit{
  titulo: string = '';
  imagen: string = '';
  audio: string = '';
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.titulo = params['titulo'];
      this.imagen = params['img'];
      this.audio = params['audio'];
    });
  }
  @ViewChild('audioPlayer', { static: true }) audioPlayerRef!: ElementRef<HTMLAudioElement>;

  isPlaying = false;

  toggleAudio() {
    const audio = this.audioPlayerRef.nativeElement;

    if (audio.paused) {
      audio.play();
      this.isPlaying = true;
    } else {
      audio.pause();
      this.isPlaying = false;
    }
  }

  onEnded() {
    this.isPlaying = false;
  }
}
