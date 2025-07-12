import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from "./shared/components/sidebar/sidebar";
import { Header } from "./shared/components/header/header";
import { setTheme } from 'ngx-bootstrap/utils';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Sidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'ng-violencia-v1';
  private readonly authService = inject(AuthService);
  
  // Usar getter para que se actualice automáticamente
  get isAuthenticated() {
    const authenticated = this.authService.isAuthenticated();
    console.log('App isAuthenticated check:', authenticated);
    return authenticated;
  }

  constructor() {
    setTheme('bs5');
    console.log('App component initialized');

    // Aplicar el color global del sidebar para todos los usuarios
    this.applyGlobalSidebarTheme();

    // PASO 1: Limpiar localStorage para forzar login
    //localStorage.removeItem('access_token');
    console.log('localStorage limpiado, debe ir al login');
  }

  private applyGlobalSidebarTheme(): void {
    // Leer el color global guardado por el admin
    const theme = localStorage.getItem('sidebar-theme') || 'blue';
    const themes: any = {
      blue:   { primary: '#007bff', secondary: '#0056b3', text: '#ffffff' },
      green:  { primary: '#28a745', secondary: '#1e7e34', text: '#ffffff' },
      gray:   { primary: '#6c757d', secondary: '#495057', text: '#ffffff' },
      red:    { primary: '#dc3545', secondary: '#c82333', text: '#ffffff' },
      purple: { primary: '#6f42c1', secondary: '#59359a', text: '#ffffff' },
      dark:   { primary: '#343a40', secondary: '#212529', text: '#ffffff' }
    };
    const t = themes[theme] || themes['blue'];
    document.documentElement.style.setProperty('--sidebar-primary-color', t.primary);
    document.documentElement.style.setProperty('--sidebar-secondary-color', t.secondary);
    document.documentElement.style.setProperty('--sidebar-text-color', t.text);
    document.body.classList.remove('theme-blue', 'theme-green', 'theme-gray', 'theme-red', 'theme-purple', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }
}
