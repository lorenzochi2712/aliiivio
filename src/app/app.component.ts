// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

Keyboard.setScroll({ isDisabled: false });

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  private auth = inject(Auth); // ✅ Usa la versión de @angular/fire
  private router = inject(Router);
  private platform = inject(Platform);

  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    try {
      await SplashScreen.hide();
    } catch (e) {
      console.warn('Error hiding splash screen:', e);
    }

    //this.checkUserSession();
  }

  checkUserSession() {
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.router.navigateByUrl('/selector', { replaceUrl: true });
      } else {
        this.router.navigateByUrl('/splashscreen');
      }
    });
  }
}
