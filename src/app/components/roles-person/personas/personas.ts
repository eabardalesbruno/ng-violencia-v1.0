import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { PersonasService } from '../../../shared/services/personas.service';
import { PersonaResponse } from '../../../shared/models/response/personas.response';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personas',
  standalone: true,
  imports: [RouterLink, CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './personas.html',
  styleUrls: ['./personas.scss'],
  providers: [BsModalService, ToastrService]
})
export class Personas implements OnInit {

  // Inyección tradicional en el constructor
  constructor(
    private personasService: PersonasService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  nombresFilter = '';
  personas: PersonaResponse[] = [];
  persona?: PersonaResponse;
  modalRef?: BsModalRef;

  // Paginación y ordenamiento
  totalRows = 30; // Para pruebas, luego será actualizado por el backend
  pageNumber = 0;
  pageSize = 15;
  sortBy = 'nombres';
  sortDir = 'asc';

  ngOnInit(): void {
    this.loadPersonas();
  }

  onFilter() {
    this.pageNumber = 0;
    this.loadPersonas();
  }

  loadPersonas(): void {
    this.personasService
      .getClientesByPage(this.pageNumber, this.pageSize, this.sortBy, this.sortDir, this.nombresFilter)
      .subscribe({
        next: (data: any) => {
          const personas = data?._embedded?.persona_response_dto_list ?? [];
          this.personas = personas.map((p: any) => ({
            id: p.id,
            nombres: p.nombres,
            apellidos: p.apellidos,
            tipoDocumento: p.tipo_documento,
            numeroDocumento: p.numero_documento,
            fechaNacimiento: p.fecha_nacimiento,
            sexo: p.sexo
          }));
          this.totalRows = data?.page?.total_elements ?? personas.length;
          this.cdr.detectChanges(); // Soluciona el error NG0100
        },
        error: (error) => {
          console.error('Error fetching personas:', error);
          this.toastr.error('Error al obtener las personas, por favor consulte al administrador');
        }
      });
  }

  onPageChange(event: any) {
    this.pageNumber = event.offset;
    this.loadPersonas();
  }

  onSortChange(event: any) {
    if (event.sorts && event.sorts.length) {
      this.sortBy = event.sorts[0].prop;
      this.sortDir = event.sorts[0].dir;
      this.loadPersonas();
    }
  }

  deletePersona(template: TemplateRef<void>, persona: PersonaResponse): void {
    this.modalRef = this.modalService.show(template);
    this.persona = persona;
  }

  closeModal(): void {
    this.modalRef?.hide();
  }

  confirmDelete(): void {
    if (this.persona) {
      this.personasService
        .delete(this.persona.id)
        .subscribe({
          next: () => {
            this.loadPersonas();
            this.toastr.success('Persona eliminada exitosamente');
          },
          error: (error) => {
            console.error('Error deleting persona:', error);
            this.toastr.error('Error al eliminar la persona, por favor consulte al administrador');
          },
        });
      this.closeModal();
    }
  }
}