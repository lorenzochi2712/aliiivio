import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { IonIcon } from '@ionic/angular/standalone';
import { personAddOutline, logInOutline, alertCircleOutline, personCircleOutline,eyeOutline , eyeOffOutline} from 'ionicons/icons';
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
    ReactiveFormsModule,IonIcon,RouterLink
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
  constructor(){
    addIcons({ personAddOutline, logInOutline, alertCircleOutline, personCircleOutline,eyeOutline,eyeOffOutline });
  }

  async login() {
    const { email, password } = this.loginForm.value;

    if (!email || !password) return;

    try {
      await this.authService.login(email, password);
      this.loginForm.reset();// limpiamos el formulario
      this.router.navigateByUrl('/home');
    } catch (err: any) {
      this.mostrarAlerta('Error de inicio de sesión', err.message);
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  showPassword = false; // 🔐 Estado inicial: contraseña oculta

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
