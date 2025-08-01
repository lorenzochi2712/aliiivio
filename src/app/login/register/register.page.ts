import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import { addIcons } from 'ionicons';
import { IonIcon } from '@ionic/angular/standalone';
import { personAddOutline, logInOutline, alertCircleOutline, personCircleOutline, personOutline, chevronBackOutline,mailOutline, lockClosedOutline, calendarOutline, homeOutline,eyeOffOutline,eyeOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import {IonCheckbox, IonContent,IonItem,IonLabel,IonButton,IonInput,IonText,IonButtons,IonHeader,IonToolbar,IonBackButton,} from'@ionic/angular/standalone';
import { Dialog } from '@capacitor/dialog';
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
    IonButton,
    IonText,
    IonButtons,IonHeader,IonToolbar,IonBackButton
  ]
  
})
export class RegisterPage {
  registerForm: FormGroup;
  isKeyboardOpen = false;
  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({personOutline,mailOutline,lockClosedOutline,calendarOutline,homeOutline,chevronBackOutline,personAddOutline,logInOutline,alertCircleOutline,personCircleOutline,eyeOffOutline,eyeOutline});
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      domicilio: ['', Validators.required],
      terminos: [false, Validators.requiredTrue]  // ✅ Nuevo campo con validación
    });
    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardOpen = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardOpen = false;
    });
  }
  passwordValidations = {
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  symbol: false,
};
updatePasswordValidations(password: string) {
  this.passwordValidations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[\W_]/.test(password)
  };
}
ngOnInit() {
  this.registerForm.get('password')?.valueChanges.subscribe(password => {
  this.updatePasswordValidations(password);
});
    this.registerForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      ]
    ],
    confirmPassword: ['', Validators.required],
    terminos: [false, Validators.requiredTrue]
  }, { validators: this.passwordsMatchValidator });

  this.registerForm.get('password')?.valueChanges.subscribe(password => {
    this.updatePasswordValidations(password);
  });
}
async register() {
  if (this.registerForm.invalid) {
    console.warn('Formulario inválido', this.registerForm.value);
    await this.mostrarAlerta('Error', 'Por favor completa todos los campos correctamente.');
    return;
  }

  const { nombre, email, password} = this.registerForm.value;

  try {
    const uid = await this.registerService.registerUser(email, password, {
      nombre,
    });

    console.log('✅ Usuario creado con UID:', uid);
    await Dialog.alert({
    title: '¡Registro exitoso!',
    message: 'Tu cuenta ha sido creada correctamente.'
  });
    // Redirige después de cerrar la alerta
    this.router.navigateByUrl('/login');
    //await this.mostrarAlerta('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
    //this.router.navigateByUrl('/login');

  } catch (error: any) {
    console.error('❌ Error al registrar:', error);

    let mensaje = 'Ocurrió un error inesperado.';

    // Detectar errores comunes de Firebase
    switch (error.code) {
      case 'auth/email-already-in-use':
        mensaje = 'Correo ya existente. Utiliza otro correo o recupera tu contraseña.';
        break;
      case 'auth/invalid-email':
        mensaje = 'El correo ingresado no es válido.';
        break;
      case 'auth/weak-password':
        mensaje = 'La contraseña es muy débil. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.';
        break;
      case 'auth/too-many-requests':
        mensaje = 'Has realizado demasiados intentos. Intenta más tarde.';
        break;
      case 'auth/network-request-failed':
        mensaje = 'Error de red. Verifica tu conexión a internet.';
        break;
    }

    await this.mostrarAlerta('Error al registrar', mensaje);
  }
}


async mostrarAlerta(title: string, message: string) {
  await Dialog.alert({
    title,
    message,
  });
}
passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}
showPassword = false;
showConfirmPassword = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

toggleConfirmPasswordVisibility() {
  this.showConfirmPassword = !this.showConfirmPassword;
}
async mostrarAlertaNativa() {
  await Dialog.alert({
    title: 'Registro exitoso',
    message: 'Tu cuenta ha sido creada correctamente.'
  });
}
}
