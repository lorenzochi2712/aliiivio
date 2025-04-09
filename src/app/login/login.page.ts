import { Component, inject, runInInjectionContext,EnvironmentInjector  } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AlertController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private alertCtrl = inject(AlertController);
  private envInjector = inject(EnvironmentInjector); // 💡 Obligatorio

  async login() {
    const { email, password } = this.loginForm.value;
    if (!email || !password) return;
  
    await runInInjectionContext(this.envInjector, async () => {
      try {
        const cred = await signInWithEmailAndPassword(this.auth, email, password); // ✅ desde @angular/fire
        const uid = cred.user.uid;
  
        const userRef = doc(this.firestore, 'users', uid);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          const data: any = userSnap.data();
          const edad = this.calcularEdad(new Date(data.fechaNacimiento));
  
          if (edad >= 18) {
            this.mostrarAlerta('Acceso permitido', `Tienes ${edad} años.`);
          } else {
            this.mostrarAlerta('Acceso denegado', `Debes tener al menos 18 años. Tienes ${edad}.`);
          }
        } else {
          this.mostrarAlerta('Error', 'No se encontró información del usuario.');
        }
      } catch (err: any) {
        this.mostrarAlerta('Error', err.message);
      }
    });
  }

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - fechaNacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}