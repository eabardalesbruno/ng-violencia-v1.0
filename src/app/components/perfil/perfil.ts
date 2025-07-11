import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class PerfilComponent implements OnInit {
  user: any = {
    nombres: '',
    apellidos: '',
    email: '',
    username: '',
    rol: '',
    fechaRegistro: '',
    avatarUrl: ''
  };

  sidebarVisible = true;
  selectedSection: 'reportes' | 'usuarios' = 'reportes';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const jwt = this.authService.token;
    if (jwt) {
      try {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        this.user.nombres = payload.nombres || '';
        this.user.apellidos = payload.apellidos || '';
        this.user.email = payload.email || '';
        this.user.username = payload.sub || '';
        this.user.rol = (payload.roles && payload.roles[0]) || 'OPERADOR';
        this.user.fechaRegistro = payload.fechaRegistro || '';
        this.user.avatarUrl = payload.avatarUrl || '';
      } catch (e) {
        this.user.username = this.authService.user || '';
        this.user.rol = this.authService.isAdmin() ? 'ADMIN' : 'OPERADOR';
      }
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onEditarPerfil() {
    alert('Funcionalidad de edición de perfil próximamente.');
  }

  onCerrarSesion() {
    this.authService.signOut();
    window.location.href = '/sign-in';
  }
}
  