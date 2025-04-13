import { Component, Input } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.page.html',
  styleUrls: ['./audio-player.page.scss'],
  standalone: true
})
export class AudioPlayerPage {
  @Input() audios: { titulo: string, url: string, id: string }[] = [];
  currentIndex = 0;
  audio: HTMLAudioElement = new Audio();
  currentAudioId = '';
  isPlaying = false;

  constructor(private audioService: AudioService) {}

  async ngOnInit() {
    await this.loadAudio();
  }

  async loadAudio() {
    const current = this.audios[this.currentIndex];
    this.audio.src = current.url;
    this.currentAudioId = current.id;

    const savedTime = await this.audioService.loadProgress(current.id);
    this.audio.currentTime = savedTime;

    this.audio.play();
    this.isPlaying = true;

    this.audio.ontimeupdate = () => {
      this.audioService.saveProgress(current.id, this.audio.currentTime);
    };
  }

  togglePlay() {
    this.isPlaying ? this.audio.pause() : this.audio.play();
    this.isPlaying = !this.isPlaying;
  }

  async nextAudio() {
    this.audio.pause();
    if (this.currentIndex < this.audios.length - 1) {
      this.currentIndex++;
      await this.loadAudio();
    }
  }

  async prevAudio() {
    this.audio.pause();
    if (this.currentIndex > 0) {
      this.currentIndex--;
      await this.loadAudio();
    }
  }
}
