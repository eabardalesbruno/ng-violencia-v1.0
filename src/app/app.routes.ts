import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { RolesPerson } from './components/roles-person/roles-person-list/roles-person';
import { EntidadDistritoRegister } from './components/entidad-distrito/entidad-distrito-register/entidad-distrito-register';
import { EntidadDistrito } from './components/entidad-distrito/entidad-distrito-list/entidad-distrito';
import { Personas } from './components/roles-person/personas/personas';
import { PersonasRegister } from './components/roles-person/personas-register/personas-register';
import { CasosList } from './components/casos/casos-list/casos-list';
import { CasosEdit } from './components/casos/casos-edit/casos-edit';
import { CasosView } from './components/casos/casos-view/casos-view';
import { CasosRegister } from './components/casos/casos-register/casos-register';
import { RolesPersonRegister } from './components/roles-person/roles-person-register/roles-person-register';

export const routes: Routes = [
  // 🏠 Ruta principal
  {
    path: '', 
    component: Home,
    title: 'Inicio - Sistema de Violencia'
  },

  // 👥 Módulo de Roles y Personas
  {
    path: 'rolesperson',
    component: RolesPerson,
    title: 'Roles de Personas'
  },
  {
    path: 'rolesperson/register',
    component: PersonasRegister,
    title: 'Registrar Rol de Persona'
  },

  {
    path: 'rolesperson/edit/:id', 
    component: RolesPersonRegister,
    title: 'Editar Rol de Persona'
  },


  // 👤 Módulo de Personas
  {
    path: 'personas',
    component: Personas,
    title: 'Gestión de Personas'
  },
  {
    path: 'personas/register',
    component: PersonasRegister,
    title: 'Registrar Persona'
  },
  {
    path: 'personas/edit/:id',
    component: PersonasRegister,
    title: 'Editar Persona'
  },
  
  // 🏢 Módulo de Entidades por Distrito
  {
    path: 'entidaddistrito',
    component: EntidadDistrito,
    title: 'Entidades por Distrito Fiscal'
  },
  {
    path: 'entidaddistrito/register',
    component: EntidadDistritoRegister,
    title: 'Registrar Entidad-Distrito'
  },
  {
    path: 'entidaddistrito/edit/:id',
    component: EntidadDistritoRegister,
    title: 'Editar Entidad-Distrito'
  },

  // 📋 Módulo de Casos
  {
    path: 'casos',
    component: CasosList,
    title: 'Gestión de Casos'
  },
  {
    path: 'casos/register',
    component: CasosRegister,
    title: 'Registrar Caso'
  },
  {
    path: 'casos/edit/:id',
    component: CasosEdit,
    title: 'Editar Caso'
  },
  {
    path: 'casos/view/:id',
    component: CasosView,
    title: 'Ver Caso'
  },

  // 🔄 Redirecciones útiles
  {
    path: 'dashboard',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },

  // 🚫 Ruta para páginas no encontradas (debe ir al final)
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];