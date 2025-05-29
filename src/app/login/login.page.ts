import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { IonIcon } from '@ionic/angular/standalone';
import { personAddOutline, logInOutline, alertCircleOutline, personCircleOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    FormsModule,
    ReactiveFormsModule, IonIcon, RouterLink
  ]
})
export class LoginPage {
  loginForm = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  private authService = inject(AuthService);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);
  constructor() {
    addIcons({ personAddOutline, logInOutline, alertCircleOutline, personCircleOutline, eyeOutline, eyeOffOutline });
  }

  async login() {
    const { email, password } = this.loginForm.value;

    if (!email || !password) return;

    try {
      await this.authService.login(email, password);
      this.loginForm.reset();// limpiamos el formulario
      this.router.navigateByUrl('/selector');
    } catch (err: any) {
      let mensaje = 'Ocurrió un error inesperado. Intenta de nuevo.';
      // Verifica si es un error de Firebase
      switch (err.code) {
        case 'auth/invalid-email':
          mensaje = 'El correo electrónico no es válido.';
          break;
        case 'auth/user-disabled':
          mensaje = 'Este usuario ha sido deshabilitado.';
          break;
        case 'auth/user-not-found':
          mensaje = 'No se encontró una cuenta con este correo.';
          break;
        case 'auth/wrong-password':
          mensaje = 'La contraseña es incorrecta.';
          break;
        case 'auth/invalid-credential':
          mensaje = 'El usuario o la contraseña es incorrecta.';
          break;
        default:
          mensaje = err.message;
      }
      this.mostrarAlerta('Error de inicio de sesión', mensaje);
    }
  }
  async mostrarAlerta(title: string, message: string) {
    await Dialog.alert({
      title,
      message,
    });
  }
  showPassword = false; // 🔐 Estado inicial: contraseña oculta

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  loginsinatentificacion() {
    this.mostrarAlerta('Ingreso exitoso', 'Puedes acceder a los audios sin cuenta. Regístrate solo si deseas guardar tu avance o recibir recomendaciones personalizadas.');
    this.router.navigateByUrl('/selector');
  }
}
