import { Injectable, inject, runInInjectionContext, EnvironmentInjector } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector);

  getUserData(uid: string) {
    return runInInjectionContext(this.injector, async () => {
      const userRef = doc(this.firestore, 'users', uid);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data() : null;
    });
  }
}