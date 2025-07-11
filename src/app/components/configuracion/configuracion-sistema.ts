import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

export interface SidebarTheme {
  name: string;
  value: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
}

@Component({
  selector: 'app-configuracion-sistema',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './configuracion-sistema.html',
  styleUrl: './configuracion-sistema.scss'
})
export class ConfiguracionSistema {
  private readonly authService = inject(AuthService);
  
  currentTheme: string = 'blue';
  originalTheme: string = 'blue';
  hasChanges: boolean = false;

  // Definición de temas disponibles
  themes: { [key: string]: SidebarTheme } = {
    blue: {
      name: 'Azul',
      value: 'blue',
      primaryColor: '#007bff',
      secondaryColor: '#0056b3',
      textColor: '#ffffff'
    },
    green: {
      name: 'Verde',
      value: 'green',
      primaryColor: '#28a745',
      secondaryColor: '#1e7e34',
      textColor: '#ffffff'
    },
    gray: {
      name: 'Plomo',
      value: 'gray',
      primaryColor: '#6c757d',
      secondaryColor: '#495057',
      textColor: '#ffffff'
    },
    red: {
      name: 'Rojo',
      value: 'red',
      primaryColor: '#dc3545',
      secondaryColor: '#c82333',
      textColor: '#ffffff'
    },
    purple: {
      name: 'Púrpura',
      value: 'purple',
      primaryColor: '#6f42c1',
      secondaryColor: '#59359a',
      textColor: '#ffffff'
    },
    dark: {
      name: 'Oscuro',
      value: 'dark',
      primaryColor: '#343a40',
      secondaryColor: '#212529',
      textColor: '#ffffff'
    }
  };

  constructor() {
    // Verificar que el usuario sea ADMIN
    if (!this.authService.isAdmin()) {
      console.warn('⚠️ Acceso denegado: Solo administradores pueden acceder a configuración');
      // En una aplicación real, aquí redirigirías o mostrarías un error
    }

    // Cargar tema actual desde localStorage
    this.loadCurrentTheme();
  }

  loadCurrentTheme(): void {
    const savedTheme = localStorage.getItem('sidebar-theme');
    this.currentTheme = savedTheme || 'blue';
    this.originalTheme = this.currentTheme;
    this.applyThemeToDocument();
  }

  changeTheme(theme: string): void {
    if (this.themes[theme]) {
      this.currentTheme = theme;
      this.hasChanges = this.currentTheme !== this.originalTheme;
      this.applyThemeToDocument();
      console.log(`🎨 Tema cambiado a: ${this.themes[theme].name}`);
    }
  }

  applyThemeToDocument(): void {
    const theme = this.themes[this.currentTheme];
    if (!theme) return;

    // Aplicar variables CSS personalizadas
    document.documentElement.style.setProperty('--sidebar-primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--sidebar-secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--sidebar-text-color', theme.textColor);
    
    // Agregar clase al body para el tema
    document.body.classList.remove('theme-blue', 'theme-green', 'theme-gray', 'theme-red', 'theme-purple', 'theme-dark');
    document.body.classList.add(`theme-${this.currentTheme}`);
  }

  saveConfiguration(): void {
    // Guardar en localStorage
    localStorage.setItem('sidebar-theme', this.currentTheme);
    this.originalTheme = this.currentTheme;
    this.hasChanges = false;

    // En una aplicación real, aquí enviarías la configuración al servidor
    console.log(`✅ Configuración guardada: Tema ${this.themes[this.currentTheme].name}`);
    
    // Mostrar mensaje de éxito (puedes usar un servicio de notificaciones)
    this.showSuccessMessage();
  }

  resetToDefault(): void {
    this.changeTheme('blue');
  }

  getCurrentThemeColor(): string {
    return this.themes[this.currentTheme]?.primaryColor || '#007bff';
  }

  getCurrentThemeName(): string {
    return this.themes[this.currentTheme]?.name || 'Azul';
  }

  private showSuccessMessage(): void {
    // Crear y mostrar un mensaje temporal de éxito
    const alert = document.createElement('div');
    alert.className = 'alert alert-success position-fixed';
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
      <i class="bi bi-check-circle me-2"></i>
      <strong>¡Configuración guardada!</strong> El tema se ha aplicado correctamente.
    `;
    
    document.body.appendChild(alert);
    
    // Remover el mensaje después de 3 segundos
    setTimeout(() => {
      if (document.body.contains(alert)) {
        document.body.removeChild(alert);
      }
    }, 3000);
  }
}
