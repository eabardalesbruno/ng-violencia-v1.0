import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./shared/components/sidebar/sidebar";
import { Header } from "./shared/components/header/header";
import { setTheme } from 'ngx-bootstrap/utils';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar,  Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'ng-violencia-v1';
  private readonly authService = inject(AuthService);
  isAuthenticated = this.authService.isAuthenticated();


constructor() {
  setTheme('bs5');
   console.log('App component initialized');
 effect(() => {
      this.isAuthenticated = this.authService.isAuthenticated();
    })
  }


}
