import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
  standalone: true,
  imports: [IonContent, IonImg, CommonModule, FormsModule]
})
export class SplashscreenPage implements OnInit {

  constructor(public router: Router) {
    if (1 == 1) {
      this.reproducir();
    }
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 4000);
  }

  ngOnInit() {
  }
  //metodo reproducir audio inicial
  reproducir() {
    const audio = new Audio('assets/audinicio.mp3');
    audio.play();
  }

}
