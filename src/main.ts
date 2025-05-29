import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';

import { initializeAuth, indexedDBLocalPersistence, provideAuth, getAuth } from '@angular/fire/auth';
import { Capacitor } from '@capacitor/core';
import { environment } from './environments/environment';
import { getApp } from '@angular/fire/app';
import { register } from 'swiper/element/bundle'

import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, homeOutline, calendarOutline } from 'ionicons/icons';

register();
addIcons({
  'person-outline': personOutline,
  'mail-outline': mailOutline,
  'lock-closed-outline': lockClosedOutline,
  'home-outline': homeOutline,
  'calendar-outline': calendarOutline
});
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    //provideAuth(() => getAuth()),
    provideAuth(() => {
      const auth = initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence
      });
      return auth;
    }),


    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions()),
    provideAnalytics(() => getAnalytics()),

    ScreenTrackingService,
    UserTrackingService
  ]
});
