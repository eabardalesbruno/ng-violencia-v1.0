import { Component, inject, OnInit } from '@angular/core';
import { RolesPersonService } from '../../../shared/services/roles-person.service';


@Component({
  selector: 'app-entidad-distrito',
  standalone: true,
  imports: [],
  templateUrl: './entidad-distrito.html',
  styleUrl: './entidad-distrito.css'
})
export class EntidadDistrito implements OnInit {

  private readonly rolesPersonService = inject(RolesPersonService);

  EntidadDistrito: any[] = [];


  ngOnInit(): void {
    this.rolesPersonService
      .getRolesperson()
      .subscribe({
        next: (EntidadDistrito) => {
           console.log('Distrito Entidad Data:', EntidadDistrito);
           this.EntidadDistrito = EntidadDistrito;
           console.log('this:', this.EntidadDistrito);
   
        },
        error: (error) => {
          console.error('Error fetching Entidad distrito data:', error);
        }
      });
  }
}