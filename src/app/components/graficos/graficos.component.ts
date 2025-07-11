import { Component } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent {
  graficos = [
    { titulo: 'Administradores', rol: 'admin', valor: 90 },
    { titulo: 'Operadores', rol: 'operador', valor: 60 }
  ];
}
