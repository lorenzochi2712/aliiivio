import { Injectable, inject, EnvironmentInjector } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public auth = inject(Auth);
  private injector = inject(EnvironmentInjector);
  public user$: Observable<User | null>;

  constructor() {
    this.user$ = authState(this.auth);
  }

  // ✅ Iniciar sesión con correo y contraseña
  login(email: string, password: string): Promise<any> {
    return this.injector.runInContext(() =>
      signInWithEmailAndPassword(this.auth, email, password)
    );
  }

  // ✅ Registrar nuevo usuario
  register(email: string, password: string): Promise<any> {
    return this.injector.runInContext(() =>
      createUserWithEmailAndPassword(this.auth, email, password)
    );
  }

  // ✅ Cerrar sesión
  logout(): Promise<void> {
    return this.injector.runInContext(() =>
      signOut(this.auth)
    );
  }

  // ✅ Obtener usuario actualmente autenticado (una vez)
  getCurrentUser(): Promise<User | null> {
    return this.injector.runInContext(() => {
      return new Promise(resolve => {
        const unsubscribe = onAuthStateChanged(this.auth, user => {
          unsubscribe();
          resolve(user);
        });
      });
    });
  }

  // ❌ Solo retorna observable (no requiere contexto especial)
  getAuthState(): Observable<User | null> {
    return authState(this.auth);
  }

  // ✅ Actualizar perfil del usuario (nombre)
  async updateUserProfile(displayName: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await this.injector.runInContext(() =>
        updateProfile(user, { displayName })
      );
    }
  }

  // ✅ Eliminar cuenta del usuario autenticado
  async deleteAccount(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await this.injector.runInContext(() =>
        deleteUser(user)
      );
    } else {
      throw new Error('No hay usuario autenticado');
    }
  }

  // ❌ Solo acceso a propiedad
  getUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  // ❌ Solo acceso a propiedad
  getUserUID(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  // ✅ Recuperación de contraseña
  async enviarCorreoRecuperacion(email: string): Promise<void> {
    return this.injector.runInContext(() =>
      sendPasswordResetEmail(this.auth, email)
    );
  }
  async signOut(): Promise<void> {
  await this.auth.signOut();
}
}
