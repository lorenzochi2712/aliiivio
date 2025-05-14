import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import { addIcons } from 'ionicons';
import { IonIcon } from '@ionic/angular/standalone';
import { personAddOutline, logInOutline, alertCircleOutline, personCircleOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import {IonCheckbox, IonContent,IonItem,IonLabel,IonButton,IonInput} from'@ionic/angular/standalone'
import { TerminosComponent } from './terminos/terminos.component';
@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterModule,
    IonCheckbox,
    IonInput,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonButton
  ]
  
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({ personAddOutline, logInOutline, alertCircleOutline, personCircleOutline });
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      domicilio: ['', Validators.required],
      terminos: [false, Validators.requiredTrue]  // ✅ Nuevo campo con validación
    });
  }

  async register() {
    if (this.registerForm.invalid) {
      console.warn('Formulario inválido', this.registerForm.value);
      await this.mostrarAlerta('Error', 'Por favor completa todos los campos correctamente.');
      return;
    }
  
    const { nombre, email, password, fechaNacimiento, domicilio } = this.registerForm.value;
    const fechaISO = new Date(fechaNacimiento).toISOString();
  
    console.log('➡️ Enviando datos a RegisterService...');
  
    try {
      const uid = await this.registerService.registerUser(email, password, {
        nombre,
        fechaNacimiento: fechaISO,
        domicilio
      });
  
      console.log('✅ Usuario creado con UID:', uid);
      this.mostrarAlerta('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
       this.router.navigateByUrl('/login');
  
    } catch (error: any) {
      console.error('❌ Error al registrar:', error);
      await this.mostrarAlerta('Error al registrar', error.message || 'Ocurrió un error inesperado.');
    }
  }
  async mostrarAlerta(header: string, message: string) {
    try {
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: ['OK'],
        backdropDismiss: false // Previene que se cierre al tocar fuera
      });
  
      await alert.present();
  
      // Esperar a que el usuario cierre la alerta
      await alert.onDidDismiss();
      console.log('✅ Alerta cerrada por el usuario');
    } catch (error) {
      console.error('❌ Error al mostrar alerta:', error);
    }
  }
  

}
