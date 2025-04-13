import { Injectable, inject, EnvironmentInjector } from '@angular/core';
import { Auth, signInWithEmailAndPassword,sendPasswordResetEmail  } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(EnvironmentInjector);

  login(email: string, password: string) {
    return this.injector.runInContext(() =>
      signInWithEmailAndPassword(this.auth, email, password)
    );
  }
  async enviarCorreoRecuperacion(email: string): Promise<void> {
    return this.injector.runInContext(() =>
      sendPasswordResetEmail(this.auth, email)
    )
  }
}