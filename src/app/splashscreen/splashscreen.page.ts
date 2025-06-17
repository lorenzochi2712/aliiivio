import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
  standalone: true,
  imports: [IonContent, IonImg, CommonModule, FormsModule]
})
export class SplashscreenPage implements OnInit {
private userLoggedIn: boolean | null = null;
  constructor(public router: Router) {
     const auth = getAuth();

    // 1. Escucha el estado de autenticación
    onAuthStateChanged(auth, user => {
      this.userLoggedIn = !!user;
    });
    if (1 == 1) {
      this.reproducir();
    }
    setTimeout(() => {
      if (this.userLoggedIn) {
        this.router.navigateByUrl('/selector', { replaceUrl: true });
      } else {
        this.router.navigateByUrl('/contfree', { replaceUrl: true });
      }
    }, 5000);
  }

  ngOnInit() {
  }
  //metodo reproducir audio inicial
  reproducir() {
    const audio = new Audio('assets/audiotres.mp3');
    audio.play();
  }

}
