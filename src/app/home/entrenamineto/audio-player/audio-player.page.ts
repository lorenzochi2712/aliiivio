import { Component, EnvironmentInjector, inject, Input, OnDestroy, OnInit, runInInjectionContext } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { NgIf, NgFor, CommonModule} from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonToolbar, IonHeader, IonTitle, IonSpinner,IonRow,IonCol } from '@ionic/angular/standalone';

import { Auth } from '@angular/fire/auth';
import { Firestore, FirestoreModule } from '@angular/fire/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.page.html',
  styleUrls: ['./audio-player.page.scss'],
  standalone: true,
  imports: [
    IonRow,IonCol,
    FirestoreModule,
    CommonModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonSpinner
  ],
})
export class AudioPlayerPage implements OnInit, OnDestroy {
  constructor() {}

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private injector = inject(EnvironmentInjector);

  audioList: any[] = [];
  currentIndex: number = 0;
  audioElement = new Audio();

  loading: boolean = true;
  uid: string | null = null;
  saveInterval: any;
  

  get currentAudio() {
    return this.audioList[this.currentIndex];
  }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { playlist: any[] };

    if (!state?.playlist || state.playlist.length === 0) {
      console.warn('No playlist found in state.');
      return;
    }

    this.audioList = state.playlist;
    this.loadAndPlayAudio();

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.uid = user.uid;
        runInInjectionContext(this.injector, async () => {
          const progressRef = doc(this.firestore, `progreso/${this.uid}_${this.currentAudio.titulo}`);
          const progressSnap = await getDoc(progressRef);
          if (progressSnap.exists()) {
            const data: any = progressSnap.data();
            this.audioElement.currentTime = data?.progreso || 0;
          }
        });
      }
    });
  }

  loadAndPlayAudio() {
    if (this.audioElement.src !== this.currentAudio.rutaaudio) {
      // Pausar y limpiar el audio anterior
      this.audioElement.pause();
      this.audioElement.currentTime = 0;

      // Limpiar el src y cargar el nuevo audio
      this.audioElement.src = this.currentAudio.rutaaudio;
      this.audioElement.load(); // Recargar el audio

      // Iniciar la reproducción cuando el audio esté listo
      this.audioElement.oncanplaythrough = () => {
        console.log('Reproduciendo: ', this.currentAudio.titulo);
        this.loading = false;
        this.audioElement.play().catch((err) => console.error('Play error:', err));
      };

      this.audioElement.onerror = () => {
        console.error('Error loading audio');
        this.loading = false;
      };

      // Iniciar el guardado del progreso cada 5 segundos
      if (this.saveInterval) clearInterval(this.saveInterval);
      this.saveInterval = setInterval(() => this.saveProgress(), 5000);
    }
  }

  playPauseAudio() {
    if (this.audioElement.paused) {
      this.audioElement.play().catch((err) => console.error('Play error:', err));
    } else {
      this.audioElement.pause();
    }
  }

  playNext() {
    this.audioElement.pause();
    this.saveProgress();
    clearInterval(this.saveInterval);

    if (this.currentIndex < this.audioList.length - 1) {
      this.currentIndex++;
      this.loadAndPlayAudio(); // Cargar y reproducir el siguiente audio
    }
  }

  playPrevious() {
    this.audioElement.pause();
    this.saveProgress();
    clearInterval(this.saveInterval);

    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.loadAndPlayAudio(); // Cargar y reproducir el audio anterior
    }
  }

  skipForward() {
    this.audioElement.currentTime += 10; // Avanza 10 segundos
  }

  skipBackward() {
    this.audioElement.currentTime -= 10; // Retrocede 10 segundos
    if (this.audioElement.currentTime < 0) {
      this.audioElement.currentTime = 0;
    }
  }

  saveProgress() {
    if (!this.uid || !this.currentAudio) return;

    runInInjectionContext(this.injector, async () => {
      const progressRef = doc(this.firestore, `progreso/${this.uid}_${this.currentAudio.titulo}`);
      await setDoc(progressRef, {
        progreso: this.audioElement.currentTime,
        titulo: this.currentAudio.titulo,
        audio: this.currentAudio.rutaaudio,
        img: this.currentAudio.img
      });
    });
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement.load();
      this.audioElement.oncanplaythrough = null;
      this.audioElement.onerror = null;
    }

    this.saveProgress();
    clearInterval(this.saveInterval);
  }
}
