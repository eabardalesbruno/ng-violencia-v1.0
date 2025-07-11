import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HasRole } from '../../directives/has-role';

@Component({
  selector: '[app-sidebar]',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, HasRole],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  openRolesPerson = false;
  openEntidadDistrito = false;
  openPersonas = false;
}