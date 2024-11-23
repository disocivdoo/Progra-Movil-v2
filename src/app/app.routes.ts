import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { homeGuard } from './guards/home.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    canActivate: [loginGuard]
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.page').then(m => m.MapPage),
  },
  {
    path: 'theme',
    loadComponent: () => import('./pages/theme/theme.page').then(m => m.ThemePage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'correcto',
    loadChildren: () => import('./pages/correcto/correcto.module').then(m => m.CorrectoPageModule)
  },
  {
    path: 'incorrecto',
    loadChildren: () => import('./pages/incorrecto/incorrecto.module').then(m => m.IncorrectoPageModule)
  },
  {
    path: 'correo',
    loadChildren: () => import('./pages/correo/correo.module').then(m => m.CorreoPageModule)
  },
  {
    path: 'pregunta',
    loadChildren: () => import('./pages/pregunta/pregunta.module').then(m => m.PreguntaPageModule)
  },
  {
    path: 'miclase',  // Nueva ruta para el componente MiClaseComponent
    loadComponent: () => import('./components/miclase/miclase.component').then(m => m.MiClaseComponent)
  }
];
