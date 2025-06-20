import { Component, inject, OnInit } from '@angular/core';
import { RolesPersonService } from '../../../shared/services/roles-person.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-roles-person',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-person.html',
  styleUrl: './roles-person.css'
})
export class RolesPerson implements OnInit {

  private readonly rolesPersonService = inject(RolesPersonService);

  Rolesperson: any[] = [];


  ngOnInit(): void {
    this.rolesPersonService
      .getRolesperson()
      .subscribe({
        next: (Rolesperson) => {
           console.log('Roles Person Data:', Rolesperson);
           this.Rolesperson = Rolesperson;
           console.log('this:', this.Rolesperson);
   
        },
        error: (error) => {
          console.error('Error fetching roles person data:', error);
        }
      });
  }
}