import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CasoService } from '../../../shared/services/caso.service';

@Component({
  selector: 'app-casos-view',
  templateUrl: './casos-view.html',
  styleUrls: ['./casos-view.scss']
})
export class CasosView implements OnInit {
  caso: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private casoService: CasoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.casoService.getCaso(+id).subscribe({
        next: (data) => {
          this.caso = data;
          this.loading = false;
        },
        error: () => {
          this.caso = null;
          this.loading = false;
        }
      });
    }
  }
}