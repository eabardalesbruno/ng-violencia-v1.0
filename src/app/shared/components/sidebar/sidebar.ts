import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HasRole } from '../../directives/has-role';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: '[app-sidebar]',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, HasRole],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  public readonly authService = inject(AuthService);
  
  openRolesPerson = false;
  openEntidadDistrito = false;
  openPersonas = false;
  openCasos = false;

  constructor() {
    console.log('🔧 Sidebar initialized');
    console.log('🔧 User roles:', this.authService.roles);
    console.log('🔧 Is Admin:', this.authService.isAdmin());
    console.log('🔧 Is authenticated:', this.authService.isAuthenticated());
  }
}