import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
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
    loadComponent: () => import('./home/test/test.page').then( m => m.TestPage)
  },
  {
    path: 'audio-playerent',
    loadComponent: () => import('./home/entrenamineto/audio-player/audio-player.page').then( m => m.AudioPlayerPage)
  },
  {
    path: 'selector',
    loadComponent: () => import('./selector/selector.page').then( m => m.SelectorPage)
  }
  
];
