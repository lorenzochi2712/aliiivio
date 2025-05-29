import { Component,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

Keyboard.setScroll({ isDisabled: false });

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    try {
      await SplashScreen.hide();
    } catch (e) {
      console.warn('Error hiding splash screen:', e);
    }
  }
}
