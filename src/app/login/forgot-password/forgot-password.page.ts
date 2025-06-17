import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service'; // ajusta la ruta según tu proyecto
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class ForgotPasswordPage {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    addIcons({chevronBackOutline });
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async recuperar() {
    if (this.form.invalid) return;

    const email = this.form.value.email;

    try {
      await this.authService.enviarCorreoRecuperacion(email);
      await this.mostrarToast('Correo de recuperación enviado.');
      this.router.navigateByUrl('/login');
    } catch (error: any) {
      await this.mostrarAlerta('Error', error.message || 'No se pudo enviar el correo.');
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}
