import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: '[app-header]',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = this.authService.user;
  sidebarOpen = true;

  ngOnInit() {
    this.applySidebarTheme();
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar-wrapper') as HTMLElement;
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
    }
    this.sidebarOpen = !this.sidebarOpen;
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/sign-in']);
  }

  // Aplica el color global del sidebar también al header
  applySidebarTheme() {
    const theme = localStorage.getItem('sidebar-theme') || 'blue';
    document.body.classList.remove(
      'theme-blue', 'theme-green', 'theme-gray', 'theme-red', 'theme-purple', 'theme-dark'
    );
    document.body.classList.add(`theme-${theme}`);
    // Si quieres aplicar variables CSS personalizadas:
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
  }
}
