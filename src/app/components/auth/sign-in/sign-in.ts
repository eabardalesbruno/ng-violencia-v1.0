import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss'
})
export class SignIn {

  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  submitted = false;

  usuario = new FormControl<string>('', [
    Validators.required
  ]);

  contrasena = new FormControl<string>('', [
    Validators.required
  ]);

  loginForm = this.formBuilder.group({
    userName: this.usuario,
    contrasena: this.contrasena
  });

  login(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const { userName, contrasena } = this.loginForm.getRawValue();

    this.authService
      .signIn(userName!, contrasena!)
      .subscribe({
        next: (response) => {
          this.toastr.success('Bienvenido...!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          if (error.error?.message?.includes('Bad credentials')) {
            this.toastr.error('Credenciales incorrectas');
          } else {
            this.toastr.error('Error interno del servidor, consulte con soporte.');
            console.log('Error en Ingresar', error);
          }
        }
      })
  }
}
