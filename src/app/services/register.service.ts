import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { doc, setDoc } from 'firebase/firestore'; // ⚠️ nota: aquí sí se usa desde firebase/firestore

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private injector = inject(EnvironmentInjector);

  async registerUser(email: string, password: string, data: any): Promise<string> {
    return runInInjectionContext(this.injector, async () => {
      const auth = inject(Auth);
      const firestore = inject(Firestore); // este es el wrapper Angular para Firebase Firestore

      // Crear usuario
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // ⚠️ Aquí usamos directamente firestore.firestore, el acceso interno al SDK
      const userRef = doc(firestore, `users/${uid}`);
      await setDoc(userRef, data);

      return uid;
    });
  }
}
