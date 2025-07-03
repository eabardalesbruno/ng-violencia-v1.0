import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { RolesPersonService } from '../../../shared/services/roles-person.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface RolesPersonResponse {
  id: number;
  caso_id: number;
  persona_id: number;
  rol_id: number;
}

interface EnrichedRolesPersonRow {
  id: number;
  caso_id: number;
  persona_id: number;
  rol_id: number;
  persona_nombre?: string;
  rol_nombre?: string;
  caso_codigo?: string;
  loading?: boolean;
  error?: string;
}

@Component({
  selector: 'app-roles-person',
  standalone: true,
  imports: [RouterLink, CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './roles-person.html',
  providers: [BsModalService, ToastrService]
})
export class RolesPerson implements OnInit {

  constructor(
    private rolesPersonService: RolesPersonService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild(DatatableComponent) table!: DatatableComponent<EnrichedRolesPersonRow>;

  idFilter = '';
  searchText = '';
  isSearching = false;
  personas: EnrichedRolesPersonRow[] = [];
  persona?: EnrichedRolesPersonRow;
  modalRef?: BsModalRef;
  isLoading = false;

  totalRows = 0; 
  pageNumber = 0;
  pageSize = 5;
  sortBy = 'id';
  sortDir = 'asc';

  ngOnInit(): void {
    this.loadPersonas();
  }

  // 🆕 Limpiar búsqueda
  clearSearch(): void {
    this.searchText = '';
    this.idFilter = '';
    this.pageNumber = 0;
    if (this.table) {
      this.table.offset = this.pageNumber;
    }
    this.loadPersonas();
    this.toastr.info('Búsqueda limpiada');
  }

  onFilter() {
    this.pageNumber = 0;
    this.search(this.searchText || this.idFilter);
  }

  loadPersonas(): void {
    this.isLoading = true;
    const idNumber = this.idFilter ? parseInt(this.idFilter) : undefined;

    this.rolesPersonService
      .getRolesPersonCasoByPageAndId(this.pageNumber, this.pageSize, this.sortBy, this.sortDir, idNumber)
      .subscribe({
        next: (data: any) => {
          const basePersonas: RolesPersonResponse[] = data?.content || [];
          this.totalRows = data?.total_elements || 0;
          
          // Convert to enriched format and enrich data
          this.personas = basePersonas.map(persona => ({
            ...persona,
            loading: true
          }));
          
          this.cdr.detectChanges();
          
          // Enrich each row with additional data
          this.enrichPersonasData();
        },
        error: (error) => {
          console.error('Error fetching roles personas:', error);
          this.toastr.error('Error al obtener los roles de personas, por favor consulte al administrador');
          this.isLoading = false;
        }
      });
  }

  private enrichPersonasData(): void {
    this.personas.forEach((persona, index) => {
      // Create observables for each detail lookup with error handling
      const personaDetail$ = this.rolesPersonService.getPersonaById(persona.persona_id).pipe(
        catchError((error) => {
          console.error(`Error fetching persona ${persona.persona_id}:`, error);
          return of({ id: persona.persona_id, nombres: 'Error', apellidos: 'al cargar', tipo_documento: '', numero_documento: '', fecha_nacimiento: '', sexo: '' });
        })
      );
      
      const rolDetail$ = this.rolesPersonService.getRolById(persona.rol_id).pipe(
        catchError((error) => {
          console.error(`Error fetching rol ${persona.rol_id}:`, error);
          return of({ id: persona.rol_id, nombre: 'Error al cargar' });
        })
      );
      
      const casoDetail$ = this.rolesPersonService.getCasoById(persona.caso_id).pipe(
        catchError((error) => {
          console.error(`Error fetching caso ${persona.caso_id}:`, error);
          return of({ id: persona.caso_id, codigo_caso: 'Error al cargar', entidad_receptora_id: 0, fecha_caso: '', estado: '', delito_id: [] });
        })
      );

      // Use forkJoin to get all details in parallel
      forkJoin({
        persona: personaDetail$,
        rol: rolDetail$,
        caso: casoDetail$
      }).subscribe({
        next: (results) => {
          // Update the persona with enriched data
          this.personas[index] = {
            ...persona,
            persona_nombre: `${results.persona.nombres} ${results.persona.apellidos}`,
            rol_nombre: results.rol.nombre,
            caso_codigo: results.caso.codigo_caso,
            loading: false
          };
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(`Error enriching data for persona ${persona.id}:`, error);
          // Keep original data but mark as not loading
          this.personas[index] = {
            ...persona,
            loading: false,
            error: 'Error al cargar detalles'
          };
          this.cdr.detectChanges();
        }
      });
    });
    
    this.isLoading = false;
  }

  // 🔍 Búsqueda unificada - siempre usa el backend filter
  search(text: string) {
    this.searchText = text.trim();
    
    if (!this.searchText) {
      // Si no hay texto, limpiar filtros y cargar todo
      this.idFilter = '';
      this.pageNumber = 0;
      if (this.table) {
        this.table.offset = this.pageNumber;
      }
      this.loadPersonas();
      return;
    }

    // Usar siempre el servicio de búsqueda del backend
    this.isSearching = true;
    this.pageNumber = 0;
    if (this.table) {
      this.table.offset = this.pageNumber;
    }
    
    // Limpiar filtros anteriores
    this.idFilter = '';
    
    this.searchWithBackend(this.searchText);
  }

  // 🆕 Búsqueda directa con el backend
  private searchWithBackend(searchTerm: string): void {
    this.isLoading = true;
    
    this.rolesPersonService
      .searchRolesPersonCasoByText(this.pageNumber, this.pageSize, this.sortBy, this.sortDir, searchTerm)
      .subscribe({
        next: (data: any) => {
          const basePersonas: RolesPersonResponse[] = data?.content || [];
          this.totalRows = data?.total_elements || 0;
          
          if (basePersonas.length > 0) {
            // Convert to enriched format and enrich data
            this.personas = basePersonas.map(persona => ({
              ...persona,
              loading: true
            }));
            
            this.cdr.detectChanges();
            this.enrichPersonasData();
            
            this.toastr.success(`Se encontraron ${this.totalRows} registros para "${searchTerm}"`);
          } else {
            this.personas = [];
            this.totalRows = 0;
            this.toastr.info(`No se encontraron registros para "${searchTerm}"`);
          }
          
          this.isSearching = false;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching roles personas:', error);
          this.toastr.error('Error al buscar registros');
          this.isSearching = false;
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: any) {
    this.pageNumber = event.offset;
    
    // Si hay una búsqueda activa, mantenerla
    if (this.searchText) {
      this.searchWithBackend(this.searchText);
    } else {
      this.loadPersonas();
    }
  }

  onSortChange(event: any) {
    if (event.sorts && event.sorts.length) {
      this.sortBy = event.sorts[0].prop;
      this.sortDir = event.sorts[0].dir;
      
      // Si hay una búsqueda activa, mantenerla
      if (this.searchText) {
        this.searchWithBackend(this.searchText);
      } else {
        this.loadPersonas();
      }
    }
  }

  deletePersona(template: TemplateRef<void>, persona: EnrichedRolesPersonRow): void {
    this.modalRef = this.modalService.show(template);
    this.persona = persona;
  }

  closeModal(): void {
    this.modalRef?.hide();
  }

  confirmDelete(): void {
    if (this.persona) {
      this.rolesPersonService.deleteRolesPersonCaso(this.persona.id).subscribe({
        next: () => {
          this.toastr.success('Registro eliminado exitosamente');
          this.loadPersonas();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error deleting roles persona:', error);
          this.toastr.error('Error al eliminar el registro');
        }
      });
    }
  }
}