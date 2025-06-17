import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard]  // ✅ PROTEGIDA
  },
  {
    path: '',
    redirectTo: 'splashscreen',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'splashscreen',
    loadComponent: () => import('./splashscreen/splashscreen.page').then( m => m.SplashscreenPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./login/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./login/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'audio-player',
    loadComponent: () => import('./home/audio-player/audio-player.page').then( m => m.AudioPlayerPage)
  },
  {
    path: 'test',
    loadComponent: () => import('./home/test/test.page').then( m => m.TestPage),
    canActivate: [AuthGuard]  // ✅ PROTEGIDA
  },
  {
    path: 'audio-playerent',
    loadComponent: () => import('./home/entrenamineto/audio-player/audio-player.page').then( m => m.AudioPlayerPage)
  },
  {
    path: 'selector',
    loadComponent: () => import('./selector/selector.page').then( m => m.SelectorPage),
    canActivate: [AuthGuard]  // ✅ PROTEGIDA
  },
  {
    path: 'contfree',
    loadComponent: () => import('./contfree/contfree.page').then( m => m.ContfreePage)
  },
  {
    path: 'reproductor',
    loadComponent: () => import('./contfree/reproductor/reproductor.page').then( m => m.ReproductorPage)
  },
  {
    path: 'editar-perfil',
    loadComponent: () => import('./home/editar-perfil/editar-perfil.page').then( m => m.EditarPerfilPage),
    canActivate: [AuthGuard]  // ✅ PROTEGIDA
  },
  
];
