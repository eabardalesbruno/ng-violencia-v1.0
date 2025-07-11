import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { RolesPerson } from './components/roles-person/roles-person-list/roles-person';

// (La ruta de configuración se agregará más abajo, antes de las redirecciones)
import { EntidadDistritoRegister } from './components/entidad-distrito/entidad-distrito-register/entidad-distrito-register';
import { EntidadDistrito } from './components/entidad-distrito/entidad-distrito-list/entidad-distrito';
import { Personas } from './components/roles-person/personas/personas';
import { PersonasRegister } from './components/roles-person/personas-register/personas-register';
import { CasosList } from './components/casos/casos-list/casos-list';
import { CasosEdit } from './components/casos/casos-edit/casos-edit';
import { CasosView } from './components/casos/casos-view/casos-view';
import { CasosRegister } from './components/casos/casos-register/casos-register';
import { RolesPersonRegister } from './components/roles-person/roles-person-register/roles-person-register';
import { SignIn } from './components/auth/sign-in/sign-in';
import { ConfiguracionSistema } from './components/configuracion/configuracion-sistema';
import { authGuard } from './shared/guards/auth-guard';
import { noAuthGuard } from './shared/guards/no-auth-guard';
import { GraficosComponent } from './components/graficos/graficos.component';

export const routes: Routes = [
  // 👤 Perfil de Usuario
  {
    path: 'perfil',
    loadComponent: () => import('./components/perfil/perfil').then(m => m.PerfilComponent),
    title: 'Mi Perfil',
    canActivate: [authGuard]
  },
  // 🔀 Redirección por defecto al login
  {
    path: '', 
    redirectTo: '/sign-in',
    pathMatch: 'full'
  },
  
  // 🏠 Ruta principal (home)
  {
    path: 'home', 
    component: Home,
    title: 'Inicio - Sistema de Violencia',
    canActivate: [authGuard]
  },

  // 👥 Módulo de Roles y Personas
  {
    path: 'rolesperson',
    component: RolesPerson,
    title: 'Roles de Personas',
    canActivate: [authGuard]
  },
  {
    path: 'rolesperson/register',
    component: PersonasRegister,
    title: 'Registrar Rol de Persona',
    canActivate: [authGuard]
  },

  {
    path: 'rolesperson/edit/:id', 
    component: RolesPersonRegister,
    title: 'Editar Rol de Persona',
    canActivate: [authGuard]
  },


  // 👤 Módulo de Personas
  {
    path: 'personas',
    component: Personas,
    title: 'Gestión de Personas',
    canActivate: [authGuard],
    data: {
      roles: ['VICTIMAS_LISTAR']
    }
  },
  {
    path: 'personas/register',
    component: PersonasRegister,
    title: 'Registrar Persona',
    canActivate: [authGuard],
      data: {
      roles: ['VICTIMAS_CREAR']
    }
  },
  {
    path: 'personas/edit/:id',
    component: PersonasRegister,
    title: 'Editar Persona',
    canActivate: [authGuard],
      data: {
      roles: ['VICTIMAS_EDITAR']
    }
  },
  
  // 🏢 Módulo de Entidades por Distrito
  {
    path: 'entidaddistrito',
    component: EntidadDistrito,
    title: 'Entidades por Distrito Fiscal',
    canActivate: [authGuard],
       data: {
      roles: ['ENTIDADES_LISTAR']
    }
  },
  {
    path: 'entidaddistrito/register',
    component: EntidadDistritoRegister,
    title: 'Registrar Entidad-Distrito',
    canActivate: [authGuard]
  },
  {
    path: 'entidaddistrito/edit/:id',
    component: EntidadDistritoRegister,
    title: 'Editar Entidad-Distrito',
    canActivate: [authGuard]
  },

  // 📋 Módulo de Casos
  {
    path: 'casos',
    component: CasosList,
    title: 'Gestión de Casos',
    canActivate: [authGuard],
      data: {
      roles: ['CASOS_LISTAR']
    }

  },
  {
    path: 'casos/register',
    component: CasosRegister,
    title: 'Registrar Caso',
    canActivate: [authGuard],
      data: {
      roles: ['CASOS_CREAR']
    }
  },
  {
    path: 'casos/edit/:id',
    component: CasosEdit,
    title: 'Editar Caso',
    canActivate: [authGuard],
      data: {
      roles: ['CASOS_EDITAR']
    }
  },
  {
    path: 'casos/view/:id',
    component: CasosView,
    title: 'Ver Caso',
    canActivate: [authGuard]
  },

  // 📊 Ruta para Reportes y Estadísticas
  {
    path: 'graficosyestadisticas',
    component: GraficosComponent,
    title: 'Reportes y Estadísticas',
    canActivate: [authGuard]
  },

  // ⚙️ Configuración del Sistema (Solo ADMIN)
  {
    path: 'configuracion',
    component: ConfiguracionSistema,
    title: 'Configuración del Sistema',
    canActivate: [authGuard]
  },

  // � Autenticación (DEBE IR ANTES de las rutas catch-all)
  {
    path: 'sign-in',
    component: SignIn,
    title: 'Iniciar Sesión',
    canActivate: [noAuthGuard]
  },

  // � Redirecciones útiles
  {
    path: 'dashboard',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  // 🚫 Ruta para páginas no encontradas (DEBE IR AL FINAL)
  {
    path: '**',
    redirectTo: '/sign-in',
    pathMatch: 'full'
  }

];