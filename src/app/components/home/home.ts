import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'scale(0.8)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({
          opacity: 0,
          transform: 'scale(0.8)'
        }))
      ])
    ])
  ]
})
export class Home implements OnInit {
  showWelcomeModal = true;
  
  // Stats properties
  totalCasos = 156;
  totalPersonas = 342;
  casosResueltos = 89;
  casosEnProceso = 67;
  
  // Recent activity data
  ultimoCaso = '2024-001';
  casoActualizado = '2024-003';
  ultimaPersona = 'Juan Carlos Pérez';

  ngOnInit() {
    // Initialize any data loading here
    this.loadStats();
  }

  closeWelcomeModal() {
    this.showWelcomeModal = false;
  }

  private loadStats() {
    // TODO: Load real stats from services
    // This is where you would call your backend services
    // to get real-time statistics
  }
}
