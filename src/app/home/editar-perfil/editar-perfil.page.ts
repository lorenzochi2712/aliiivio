import { Component, OnInit, OnDestroy, Injector, runInInjectionContext } from '@angular/core';
import { AlertController, ToastController, NavController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { chevronBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit, OnDestroy {
  nombre: string = '';
  correo: string = '';
  password: string = '';
  confirmPassword: string = '';
  currentPassword: string = ''; // Para reautenticación

  private userSubscription?: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private injector: Injector
  ) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit() {
    this.loadUserData();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Cargar datos del usuario actual
  private loadUserData() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        this.nombre = user.displayName || '';
        this.correo = user.email || '';
      } else {
        // Si no hay usuario, redirigir al login
        this.navCtrl.navigateRoot('/login');
      }
    });
  }

  async guardarCambios() {
    let cambiosRealizados = false;
    let mensajes: string[] = [];

    try {
      // 1. Verificar si se cambiará el nombre
      const nombreActual = (this.authService.auth.currentUser?.displayName || '').trim();
      const cambioNombre = this.nombre.trim() && this.nombre.trim() !== nombreActual;

      // 2. Verificar si se cambiará la contraseña
      const cambioPassword = this.password && this.isPasswordValid() && this.password === this.confirmPassword;

      // Si no hay cambios, salir
      if (!cambioNombre && !cambioPassword) {
        this.toast('No hay cambios para guardar', 'warning');
        return;
      }

      // 3. Si hay cambio de contraseña, primero pedir la contraseña actual
      if (cambioPassword) {
        try {
          await this.actualizarPassword(); // Aquí se valida el password actual
          mensajes.push('Contraseña actualizada');
          cambiosRealizados = true;
          this.password = '';
          this.confirmPassword = '';
        } catch (err) {
          if (err instanceof Error) {
            if (err.message === 'Cancelado por el usuario') {
              this.toast('Operación cancelada', 'medium');
            } else {
              this.handleError(err);
            }
          } else {
            this.toast('Ha ocurrido un error desconocido', 'danger');
          }
          return;
        }
      }

      // 4. Mostrar loading solo si hay cambios a aplicar
      const loading = await this.loadingCtrl.create({
        message: 'Guardando cambios...',
        spinner: 'crescent'
      });
      await loading.present();

      // 5. Cambiar nombre si aplica
      if (cambioNombre) {
        await this.authService.updateUserProfile(this.nombre.trim());
        mensajes.push('Nombre actualizado');
        cambiosRealizados = true;
      }

      loading.dismiss();

      // 6. Mostrar resultado
      if (cambiosRealizados) {
        const mensaje = mensajes.join(' y ');
        this.toast(`${mensaje} exitosamente`, 'success');
      }

    } catch (error: any) {
      this.handleError(error);
    }
  }

  private async actualizarPassword() {
    return new Promise<void>((resolve, reject) => {
      this.alertCtrl.create({
        cssClass: 'custom-alert',
        header: 'Contraseña actual requerida',
        message: 'Para cambiar tu contraseña, necesitas ingresar tu contraseña actual.',
        inputs: [
          {
            name: 'currentPassword',
            type: 'password',
            placeholder: 'Contraseña actual'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              reject(new Error('Cancelado por el usuario'));
            }
          },
          {
            text: 'Continuar',
            handler: async (data) => {
              if (!data.currentPassword) {
                this.toast('Debes ingresar tu contraseña actual', 'danger');
                reject(new Error('Contraseña actual requerida'));
                return;
              }

              try {
                await this.cambiarPassword(data.currentPassword);
                resolve();
              } catch (error) {
                reject(error);
              }
            }
          }
        ]
      }).then(alert => alert.present());
    });
  }

  private async cambiarPassword(currentPassword: string) {
    try {
      const user = await this.authService.getCurrentUser();
      if (!user || !user.email) {
        throw new Error('No hay usuario autenticado');
      }

      console.log('Iniciando cambio de contraseña...');

      // Usar runInInjectionContext para las APIs de Firebase
      await runInInjectionContext(this.injector, async () => {
        // Reautenticar usuario
        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(user, credential);
        console.log('Reautenticación exitosa');

        // Actualizar contraseña
        await updatePassword(user, this.password);
      });

      await Dialog.alert({
        title: 'Modificacion exitosa!',
        message: 'Tu cuenta ha sido actualizada correctamente.'
      });

    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);

      if (error.code === 'auth/wrong-password') {
        throw new Error('La contraseña actual es incorrecta');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('La nueva contraseña es muy débil');
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error('Por seguridad, necesitas iniciar sesión nuevamente');
      }
      throw error;
    }
  }

  async eliminarCuenta(currentPassword: string) {
    console.log('=== INICIO ELIMINACIÓN CUENTA ===');
    
    try {
      console.log('1. Verificando usuario actual...');
      
      // Verificar estado de autenticación de forma más robusta
      const currentUser = this.authService.auth.currentUser;
      console.log('Usuario actual:', currentUser?.email, 'UID:', currentUser?.uid);
      
      if (!currentUser) {
        console.error('No hay usuario autenticado');
        await this.mostrarError('No hay sesión activa', 'Inicia sesión nuevamente');
        this.navCtrl.navigateRoot('/login');
        return;
      }

      if (!currentUser.email) {
        console.error('Usuario sin email');
        await this.mostrarError('Usuario inválido', 'El usuario no tiene email asociado');
        return;
      }

      console.log('2. Creando credencial...');
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      
      console.log('3. Iniciando reautenticación...');
      
      // Reautenticación con timeout y mejor manejo de errores usando runInInjectionContext
      await runInInjectionContext(this.injector, async () => {
        await Promise.race([
          reauthenticateWithCredential(currentUser, credential),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('TIMEOUT_REAUTH')), 15000)
          )
        ]);
      });
      
      console.log('4. Reautenticación exitosa');
      
      // Esperar para asegurar que la reautenticación se procese completamente
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('5. Iniciando eliminación...');
      
      // Obtener referencia fresca del usuario después de reautenticación
      const freshUser = this.authService.auth.currentUser;
      if (!freshUser) {
        throw new Error('Usuario perdido después de reautenticación');
      }
      
      // Eliminar cuenta con timeout usando runInInjectionContext
      await runInInjectionContext(this.injector, async () => {
        await Promise.race([
          freshUser.delete(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('TIMEOUT_DELETE')), 15000)
          )
        ]);
      });
      
      console.log('6. Cuenta eliminada exitosamente');
      
      
      // Limpiar completamente la sesión
      try {
        await this.authService.signOut();
      } catch (e) {
        console.log('Error al cerrar sesión (esperado):', e);
      }
      
      await Dialog.alert({
        title: '¡Cuenta eliminada!',
        message: 'Tu cuenta ha sido eliminada permanentemente.'
      });
      
      // Redirigir y limpiar navegación
      this.navCtrl.navigateRoot('/contfree', { replaceUrl: true });
      
    } catch (error: any) {
      console.error('=== ERROR ELIMINACIÓN ===', error);
      
      let title = 'Error al eliminar cuenta';
      let message = 'No se pudo eliminar la cuenta';
      let shouldRedirectToLogin = false;
      
      // Manejo específico por tipo de error
      if (error.message === 'TIMEOUT_REAUTH') {
        title = 'Timeout de reautenticación';
        message = 'La verificación de identidad tardó demasiado. Verifica tu conexión e intenta nuevamente.';
      } else if (error.message === 'TIMEOUT_DELETE') {
        title = 'Timeout de eliminación';
        message = 'La eliminación tardó demasiado. Es posible que se haya completado. Verifica tu estado de cuenta.';
        shouldRedirectToLogin = true;
      } else if (error.code) {
        switch (error.code) {
          case 'auth/wrong-password':
            title = 'Contraseña incorrecta';
            message = 'La contraseña ingresada no es correcta.';
            break;
          case 'auth/too-many-requests':
            title = 'Demasiados intentos';
            message = 'Has excedido el límite de intentos. Espera 15 minutos antes de intentar nuevamente.';
            break;
          case 'auth/network-request-failed':
            title = 'Sin conexión';
            message = 'Verifica tu conexión a internet e intenta nuevamente.';
            break;
          case 'auth/requires-recent-login':
            title = 'Sesión expirada';
            message = 'Tu sesión ha expirado. Inicia sesión nuevamente para continuar.';
            shouldRedirectToLogin = true;
            break;
          case 'auth/user-not-found':
            title = 'Usuario no encontrado';
            message = 'No se encontró tu cuenta. Es posible que ya haya sido eliminada.';
            shouldRedirectToLogin = true;
            break;
          case 'auth/user-disabled':
            title = 'Cuenta desactivada';
            message = 'Tu cuenta ha sido desactivada por el administrador.';
            break;
          case 'auth/invalid-credential':
            title = 'Credenciales inválidas';
            message = 'Las credenciales proporcionadas son inválidas o han expirado.';
            shouldRedirectToLogin = true;
            break;
          default:
            message = `Error: ${error.message || 'Error desconocido'} (${error.code})`;
        }
      } else if (error.message) {
        message = error.message;
      }
      
      await this.mostrarError(title, message);
      
      if (shouldRedirectToLogin) {
        setTimeout(() => {
          this.navCtrl.navigateRoot('/login', { replaceUrl: true });
        }, 3000);
      }
    }
    
    console.log('=== FIN ELIMINACIÓN CUENTA ===');
  }

  // Función auxiliar para mostrar errores de forma consistente
  private async mostrarError(titulo: string, mensaje: string) {
    await Dialog.alert({
      title: titulo,
      message: mensaje
    });
  }

  // Función mejorada para confirmar eliminación con validaciones adicionales
  async confirmarEliminacion() {
    // Verificar estado del usuario antes de mostrar confirmación
    const currentUser = this.authService.auth.currentUser;
    if (!currentUser) {
      await this.mostrarError('Sesión no válida', 'Debes iniciar sesión para eliminar tu cuenta');
      this.navCtrl.navigateRoot('/login');
      return;
    }

    const alert = await this.alertCtrl.create({
      cssClass: 'custom-alert',
      header: '⚠️ ELIMINACIÓN PERMANENTE',
      message: `
        ¿Estás completamente seguro?
        Esta acción:
        • Eliminará tu cuenta ${currentUser.email}
        • Borrará todos tus datos permanentemente
        • No se puede deshacer
      `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'SÍ, ELIMINAR',
          cssClass: 'alert-button-confirm',
          handler: () => this.solicitarPasswordParaEliminar(),
        },
      ],
    });

    await alert.present();
  }

  // Función mejorada para solicitar contraseña con validaciones
  private async solicitarPasswordParaEliminar() {
    const alert = await this.alertCtrl.create({
      cssClass: 'custom-alert',
      header: 'Verificación de seguridad',
      message: 'Ingresa tu contraseña actual para confirmar la eliminación de tu cuenta.',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña actual',
          attributes: {
            maxlength: 100,
            autocomplete: 'current-password',
            'data-testid': 'delete-password-input'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'ELIMINAR CUENTA',
          cssClass: 'alert-button-danger',
          handler: async (data) => {
            const password = data.password?.trim();
            
            if (!password) {
              await this.toast('Debes ingresar tu contraseña actual', 'danger');
              return false; // Mantener alert abierto
            }
            
            if (password.length < 6) {
              await this.toast('La contraseña debe tener al menos 6 caracteres', 'danger');
              return false;
            }
            
            // Cerrar el alert antes de proceder
            setTimeout(async () => {
              await this.eliminarCuenta(password);
            }, 100);
            
            return true; // Cerrar alert
          }
        }
      ]
    });
    
    await alert.present();
  }

  // Función de debug para dispositivos móviles
  async testFirebaseConnection() {
    console.log('=== TEST FIREBASE CONNECTION ===');
    try {
      const user = this.authService.auth.currentUser;
      console.log('Current user:', user?.email, user?.uid);
      console.log('User metadata:', user?.metadata);
      console.log('Auth state:', this.authService.auth.currentUser ? 'AUTHENTICATED' : 'NOT_AUTHENTICATED');
      
      if (user) {
        // Test reauth capability usando runInInjectionContext
        console.log('Testing token refresh...');
        await runInInjectionContext(this.injector, async () => {
          const token = await user.getIdToken(true);
          console.log('Token refresh successful:', !!token);
        });
      }
      
      await this.toast('Check console for Firebase connection info', 'success');
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      await this.toast('Firebase connection test failed - check console', 'danger');
    }
  }

  private handleError(error: any) {
    let message = 'Ha ocurrido un error inesperado';

    console.error('Error details:', error);

    switch (error.code) {
      case 'auth/wrong-password':
        message = 'La contraseña actual es incorrecta';
        break;
      case 'auth/weak-password':
        message = 'La nueva contraseña es muy débil';
        break;
      case 'auth/requires-recent-login':
        message = 'Por seguridad, necesitas iniciar sesión nuevamente';
        // Opcional: redirigir al login
        setTimeout(() => {
          this.navCtrl.navigateRoot('/login');
        }, 2000);
        break;
      case 'auth/user-not-found':
        message = 'Usuario no encontrado';
        break;
      case 'auth/network-request-failed':
        message = 'Error de conexión. Verifica tu internet';
        break;
      case 'auth/too-many-requests':
        message = 'Demasiados intentos. Intenta más tarde';
        break;
      case 'auth/user-disabled':
        message = 'Tu cuenta ha sido desactivada';
        break;
      default:
        if (error.message) {
          message = error.message;
        }
    }

    this.toast(message, 'danger');
  }

  async toast(msg: string, color: string = 'medium') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  isPasswordValid(): boolean {
    if (!this.password) return true; // Si no hay contraseña, no validar
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(this.password);
  }

  // Funciones individuales para validar cada requisito
  hasMinLength(): boolean {
    return this.password.length >= 8;
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.password);
  }

  hasNumber(): boolean {
    return /\d/.test(this.password);
  }

  hasSpecialChar(): boolean {
    return /[\W_]/.test(this.password);
  }

  // Verificar si hay cambios pendientes
  hayCambiosPendientes(): boolean {
    const nombreActual = (this.authService.auth.currentUser?.displayName || '').trim();
    const nombreCambio = this.nombre.trim() !== nombreActual && this.nombre.trim().length > 0;
    const passwordCambio = this.password.length > 0;

    return nombreCambio || passwordCambio;
  }

  // Verificar si el formulario es válido
  isFormValid(): boolean {
    // Si hay contraseña, debe ser válida y coincidir
    if (this.password) {
      return this.isPasswordValid() && this.password === this.confirmPassword;
    }

    // Si no hay contraseña, verificar si hay cambio en el nombre
    const nombreActual = (this.authService.auth.currentUser?.displayName || '').trim();
    return this.nombre.trim().length > 0 && this.nombre.trim() !== nombreActual;
  }
}