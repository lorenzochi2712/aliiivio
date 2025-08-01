import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  personAddOutline,
  logInOutline,
  eyeOutline,
  eyeOffOutline,
  chevronBackOutline
} from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonBackButton,
  IonIcon
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { Keyboard } from '@capacitor/keyboard';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonItem,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonInput,
    IonButton,
    FormsModule,
    ReactiveFormsModule,
    IonIcon,
    RouterLink
  ]
})
export class LoginPage implements OnInit {
  loginForm = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  showPassword = false;

  private authService = inject(AuthService);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);

  constructor() {
    addIcons({ personAddOutline, logInOutline, eyeOutline, eyeOffOutline, chevronBackOutline });
  }

  ngOnInit() {
    Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-open');

      // Scroll al botón de login
      setTimeout(() => {
        const button = document.querySelector('.login-button');
        button?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    });

    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-open');
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    const { email, password } = this.loginForm.value;
    if (!email || !password) return;

    try {
      await this.authService.login(email, password);
      this.loginForm.reset();
      localStorage.setItem('usuarioActivo', 'true');
      this.router.navigateByUrl('/selector');
    } catch (err: any) {
      const mensaje = this.obtenerMensajeDeError(err.code, err.message);
      await Dialog.alert({ title: 'Error de inicio de sesión', message: mensaje });
    }
  }

  private obtenerMensajeDeError(code: string, fallback: string): string {
    const mensajes: { [key: string]: string } = {
      'auth/invalid-email': 'El correo electrónico no es válido.',
      'auth/user-disabled': 'Este usuario ha sido deshabilitado.',
      'auth/user-not-found': 'No se encontró una cuenta con este correo.',
      'auth/wrong-password': 'El usuario o la contraseña es incorrecta.',
      'auth/invalid-credential': 'El usuario o la contraseña es incorrecta.'
    };
    return mensajes[code] || fallback || 'Ocurrió un error inesperado.';
  }
}
