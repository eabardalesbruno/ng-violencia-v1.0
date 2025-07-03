import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { EntidadDistritoService } from '../../../shared/services/entidad-distrito.service';
import { DistritoFiscalService, DistritoFiscal } from '../../../shared/services/distrito-fiscal.service';
import { EntidadDistritoResponse, EntidadDistritoMapped, Entidad } from '../../../shared/models/response/entidad-distrito.response';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-entidad-distrito-list',
  standalone: true,
  imports: [RouterLink, CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './entidad-distrito.html',
  styleUrls: ['./entidad-distrito.scss'],
  providers: [BsModalService, ToastrService]
})
export class EntidadDistrito implements OnInit {

  @ViewChild(DatatableComponent) table!: DatatableComponent<EntidadDistritoMapped>;

  // Variables corregidas
  filtroGeneral = ''; // Campo de búsqueda visible para el usuario
  entidadesDistrito: EntidadDistritoMapped[] = [];
  entidadesDistritoOriginal: EntidadDistritoMapped[] = []; // Lista original sin filtrar
  entidadDistrito?: EntidadDistritoMapped;
  modalRef?: BsModalRef;

  // Catálogos para mapear nombres
  entidades: Entidad[] = [];
  distritos: DistritoFiscal[] = [];
  distritosIds: string = ''; // IDs de distritos separados por coma

  totalRows = 0; 
  pageNumber = 0;
  pageSize = 10; // Cambiado a 10 para coincidir con tu URL de prueba
  sortBy = 'id';
  sortDir = 'asc';

  constructor(
    private entidadDistritoService: EntidadDistritoService,
    private distritoFiscalService: DistritoFiscalService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  
  ngOnInit(): void {
    this.loadCatalogos();
  }

  // Cargar catálogos desde los servicios
  private loadCatalogos(): void {
    // Cargar distritos fiscales y entidades en paralelo
    forkJoin({
      distritos: this.distritoFiscalService.getDistritosFiscales(),
      entidades: this.entidadDistritoService.getEntidades()
    }).subscribe({
      next: (data) => {
        // Filtrar solo distritos activos
        this.distritos = data.distritos.filter(distrito => distrito.estado);
        this.entidades = data.entidades || [];
        
        // Generar string de IDs de distritos para el filtro
        this.distritosIds = this.distritos.map(d => d.id).join(',');
        
        console.log('📋 Distritos cargados:', this.distritos);
        console.log('📋 Entidades cargadas:', this.entidades);
        console.log('🔢 IDs de distritos:', this.distritosIds);
        
        // Cargar datos después de tener los catálogos
        this.loadEntidadDistrito();
      },
      error: (error) => {
        console.error('❌ Error cargando catálogos:', error);
        this.toastr.error('Error al cargar los catálogos');
        
        // Usar datos de respaldo en caso de error
        this.distritos = [
          { id: 4, nombre: 'Ancash', estado: true },
          { id: 5, nombre: 'Ayacucho', estado: true },
          { id: 6, nombre: 'Cuzco', estado: true },
          { id: 7, nombre: 'Junín', estado: true },
          { id: 8, nombre: 'La Libertad', estado: true },
          { id: 9, nombre: 'Lima', estado: true },
          { id: 10, nombre: 'Loreto', estado: true },
          { id: 11, nombre: 'Tacna', estado: true }
        ];
        
        this.entidades = [
          { id: 9, nombre: 'Policía Nacional de Colombia' },
          { id: 10, nombre: 'Rama Judicial' },
          { id: 16, nombre: 'Ministerio de la Mujer y Equidad de Género' }
        ];
        
        this.distritosIds = this.distritos.map(d => d.id).join(',');
        this.loadEntidadDistrito();
      }
    });
  }

  // Método auxiliar para obtener nombre de entidad
  private getEntidadNombre(id: number): string {
    const entidad = this.entidades.find(e => e.id === id);
    return entidad ? entidad.nombre : `Entidad ${id}`;
  }

  // Método auxiliar para obtener nombre de distrito
  private getDistritoNombre(id: number): string {
    const distrito = this.distritos.find(d => d.id === id);
    return distrito ? distrito.nombre : `Distrito ${id}`;
  }

  // Método para convertir texto de búsqueda a IDs de distritos
  private convertirBusquedaAIds(textoBusqueda: string): string {
    if (!textoBusqueda || textoBusqueda.trim() === '') {
      // Si no hay búsqueda, devolver todos los IDs disponibles
      return this.distritosIds;
    }

    const texto = textoBusqueda.toLowerCase().trim();
    const idsEncontrados = new Set<number>();

    // Buscar en nombres de distritos
    this.distritos.forEach(distrito => {
      if (distrito.nombre.toLowerCase().includes(texto)) {
        idsEncontrados.add(distrito.id);
      }
    });

    // Buscar en nombres de entidades
    this.entidades.forEach(entidad => {
      if (entidad.nombre.toLowerCase().includes(texto)) {
        idsEncontrados.add(entidad.id);
      }
    });

    // Si no se encontró nada por nombre, intentar buscar por ID
    if (idsEncontrados.size === 0) {
      const numero = parseInt(texto);
      if (!isNaN(numero)) {
        // Verificar si el número existe en distritos o entidades
        const existeDistrito = this.distritos.some(d => d.id === numero);
        const existeEntidad = this.entidades.some(e => e.id === numero);
        
        if (existeDistrito || existeEntidad) {
          idsEncontrados.add(numero);
        }
      }
    }

    // Si no se encontró nada, devolver string vacío para no mostrar resultados
    if (idsEncontrados.size === 0) {
      return '';
    }

    // Si se encontraron coincidencias, devolver todos los distritos para que el backend filtre
    // El backend se encarga de filtrar por el texto de búsqueda
    return this.distritosIds;
  }

  // Método para obtener todos los IDs disponibles
  private obtenerTodosLosIds(): string {
    return this.distritosIds || '';
  }

  onFilter() {
    this.pageNumber = 0;
    this.loadEntidadDistrito();
  }

  clearFilters() {
    this.filtroGeneral = '';
    this.pageNumber = 0;
    this.loadEntidadDistrito();
  }

  loadEntidadDistrito(): void {
    // No cargar si no tenemos los IDs de distritos aún
    if (!this.distritosIds) {
      console.log('⏳ Esperando carga de distritos...');
      return;
    }

    console.log('🔍 Iniciando carga de entidades distrito...');
    
    // Cargar todos los datos sin filtro del usuario, solo con los IDs de distritos válidos
    console.log('📋 Parámetros:', {
      pageNumber: 0, // Siempre página 0 para obtener todos
      pageSize: 1000, // Tamaño grande para obtener todos los registros
      sortBy: this.sortBy,
      sortDir: this.sortDir,
      filtroDistritosIds: this.distritosIds
    });

    this.entidadDistritoService
      .getEntidadesDistritoByPage(0, 1000, this.sortBy, this.sortDir, this.distritosIds)
      .subscribe({
        next: (data) => {
          console.log('📥 Respuesta RAW del servidor:', data);
          
          // Manejar caso de respuesta vacía (HTTP 204)
          if (!data) {
            console.log('⚠️ No hay datos disponibles (HTTP 204)');
            this.entidadesDistritoOriginal = [];
            this.entidadesDistrito = [];
            this.totalRows = 0;
            this.cdr.detectChanges();
            return;
          }

          const entidadesDistrito = data?.content ?? [];
          console.log('� Entidades extraídas:', entidadesDistrito);

          // Mapear y guardar datos originales
          this.entidadesDistritoOriginal = entidadesDistrito.map((ed: EntidadDistritoResponse) => {
            return {
              id: ed.id,
              entidad_id: ed.entidad_id,
              distrito_id: ed.distrito_id,
              entidadNombre: this.getEntidadNombre(ed.entidad_id),
              distritoNombre: this.getDistritoNombre(ed.distrito_id)
            };
          });
          
          console.log('✅ Datos originales cargados:', this.entidadesDistritoOriginal);
          
          // Aplicar filtro local si existe
          this.applyLocalFilter();
        },
        error: (error: any) => {
          console.error('❌ Error fetching entidades distrito:', error);
          this.toastr.error('Error al obtener las entidades distrito, por favor consulte al administrador');
        }
      });
  }

 applyLocalFilter(): void {
  if (!this.filtroGeneral || this.filtroGeneral.trim() === '') {
    this.entidadesDistrito = [...this.entidadesDistritoOriginal];
  } else {
    // Normalizar filtro: minúsculas, sin tildes, quitar espacios extras y dividir por coma
    const normalizar = (str: string) => str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/,/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const filtros = normalizar(this.filtroGeneral).split(' ');

    this.entidadesDistrito = this.entidadesDistritoOriginal.filter(item => {
      const entidad = normalizar(item.entidadNombre);
      const distrito = normalizar(item.distritoNombre);
      const id = item.id.toString();
      // Debe coincidir al menos uno de los términos
      return filtros.some(f =>
        entidad.includes(f) ||
        distrito.includes(f) ||
        id.includes(f)
      );
    });
  }
  this.totalRows = this.entidadesDistrito.length;
  this.cdr.detectChanges();
}

search(text: string) {
  this.filtroGeneral = text;
  this.pageNumber = 0;
  this.applyLocalFilter();
}

onPageChange(event: any) {
  this.pageNumber = event.offset;
  this.applyLocalFilter();
}

onSortChange(event: any) {
  if (event.sorts && event.sorts.length) {
    this.sortBy = event.sorts[0].prop;
    this.sortDir = event.sorts[0].dir;
    // Si quieres reordenar localmente, implementa aquí
    this.applyLocalFilter();
  }
}

deleteEntidadDistrito(template: TemplateRef<void>, entidadDistrito: EntidadDistritoMapped): void {
  this.modalRef = this.modalService.show(template);
  this.entidadDistrito = entidadDistrito;
}

closeModal(): void {
  this.modalRef?.hide();
}

confirmDelete(): void {
  if (this.entidadDistrito) {
    this.entidadDistritoService
      .delete(this.entidadDistrito.id)
      .subscribe({
        next: () => {
          this.loadEntidadDistrito();
          this.toastr.success('La entidad distrito fue eliminada exitosamente');
        },
        error: (error: any) => {
          this.toastr.error('Error al eliminar la entidad distrito, por favor consulte al administrador');
        },
      });
    this.closeModal();
  }
}
}