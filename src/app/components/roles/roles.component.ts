import { Component } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
  usuarios = [
    { nombre: 'Juan Pérez', rol: 'admin' },
    { nombre: 'Ana López', rol: 'operador' }
  ];
}
