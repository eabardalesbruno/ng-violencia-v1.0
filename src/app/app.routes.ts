import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { RolesPerson } from './components/roles-person/roles-person-list/roles-person';
import { RolesPersonRegister } from './components/roles-person/roles-person-register/roles-person-register';
import { EntidadDistritoRegister } from './components/entidad-distrito/entidad-distrito-register/entidad-distrito-register';
import { EntidadDistrito } from './components/entidad-distrito/entidad-distrito-list/entidad-distrito';
import { Personas } from './components/roles-person/personas/personas';
import { PersonasRegister } from './components/roles-person/personas-register/personas-register';

export const routes: Routes = [
  {
    path: '', 
    component: Home
  },
  {
    path: 'rolesperson',
    component: RolesPerson
  },
  {
    path: 'rolesperson/register',
    component: RolesPersonRegister
  },
   {
    path: 'personas',
    component: Personas
  },
  {
    path: 'personas/register',
    component: PersonasRegister
  },
{
  path: 'personas/edit/:id',
  component: PersonasRegister
},
  
  {
    path: 'entidaddistrito',
    component: EntidadDistrito
  },
  {
    path: 'entidaddistrito/register',
    component: EntidadDistritoRegister
  }
];