import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: '[app-header]',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = this.authService.user;

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/sign-in']);
  }
}
