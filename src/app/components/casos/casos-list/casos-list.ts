import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { CasoService } from '../../../shared/services/caso.service';
import { DelitoService } from '../../../shared/services/delito.service';
import { PersonaRolesVistaService } from '../../../shared/services/persona-roles-vista.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-casos-list',
  standalone: true,
  providers: [],
  imports: [CommonModule, RouterLink, NgxDatatableModule, FormsModule  ],
   templateUrl: './casos-list.html',
  styleUrls: ['./casos-list.scss']
})
export class CasosList implements OnInit {
  // Propiedades principales
  casos: any[] = [];
  totalRows = 0;
  pageNumber = 0;
  pageSize = 10;
  delitosCatalogo: any[] = [];
  sortBy: string = 'id';
  sortDir: string = 'asc';
  searchFilter: string = '';
  
  // Gestión de pestañas
  activeTab = 'general';
  
  // Propiedades para modales
  casoDetalle: any = null;
  casoSeleccionado: any = null;
  modalDetalle: any[] = [];
  modalTitulo = '';
  modalTipo: 'delitos' | 'personas' = 'delitos';


    qrCodeDataURL: string | undefined;
  codigoQR: string = ''
  
    generateQRCode(text: string): void {
    try {
      // Usar API externa para generar QR
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
      this.qrCodeDataURL = qrApiUrl;
    } catch (error) {
      console.error('Error generando QR:', error);
      this.qrCodeDataURL = undefined;
    }
  }

  // Agregar método para copiar al portapapeles
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.toastr.success('URL copiada al portapapeles', 'Copiado');
    }).catch(() => {
      this.toastr.error('No se pudo copiar la URL', 'Error');
    });
  }


  //visor para PDF
pdfSrc: string | undefined;

  // Estados
  loadingDetalle = false;
  errorDetalle = '';

  // Filtros para personas
  filtroPersonas = '';
  filtroRol = '';

  estadosValidos = [
    'Abierto',
    'En Investigación',
    'Intermedia',
    'Preparatoria',
    'Juicio',
    'Archivado',
    'Reaperturado',
    'Registrado'
  ];

  entidadesReferencia = [
    { entidad_id: 16, distrito_id: 6, id: 22 },
    { entidad_id: 9, distrito_id: 7, id: 26 },
    { entidad_id: 9, distrito_id: 4, id: 31 },
    { entidad_id: 9, distrito_id: 5, id: 32 },
    { entidad_id: 9, distrito_id: 6, id: 33 },
    { entidad_id: 9, distrito_id: 7, id: 34 },
    { entidad_id: 9, distrito_id: 8, id: 35 },
    { entidad_id: 9, distrito_id: 9, id: 36 },
    { entidad_id: 9, distrito_id: 10, id: 37 },
    { entidad_id: 9, distrito_id: 11, id: 38 },
    { entidad_id: 10, distrito_id: 4, id: 39 },
    { entidad_id: 10, distrito_id: 5, id: 40 },
    { entidad_id: 10, distrito_id: 6, id: 41 },
    { entidad_id: 10, distrito_id: 7, id: 42 },
    { entidad_id: 10, distrito_id: 8, id: 43 },
    { entidad_id: 10, distrito_id: 9, id: 44 },
    { entidad_id: 10, distrito_id: 10, id: 45 },
    { entidad_id: 10, distrito_id: 11, id: 46 },
    { entidad_id: 16, distrito_id: 4, id: 47 },
    { entidad_id: 16, distrito_id: 5, id: 48 },
    { entidad_id: 16, distrito_id: 6, id: 49 },
    { entidad_id: 16, distrito_id: 7, id: 50 },
    { entidad_id: 16, distrito_id: 8, id: 51 },
    { entidad_id: 16, distrito_id: 9, id: 52 },
    { entidad_id: 16, distrito_id: 10, id: 53 },
    { entidad_id: 16, distrito_id: 11, id: 54 }
  ];

  entidades = [
    { id: 9, nombre: 'Policía Nacional de Colombia', tipo_entidad: 'Seguridad' },
    { id: 10, nombre: 'Rama Judicial', tipo_entidad: 'Judicial' },
    { id: 16, nombre: 'Ministerio de la Mujer y Equidad de Género', tipo_entidad: 'Ministerio' }
  ];

  distritos = [
    { id: 4, nombre: 'Ancash' },
    { id: 5, nombre: 'Ayacucho' },
    { id: 6, nombre: 'Cuzco' },
    { id: 7, nombre: 'Junín' },
    { id: 8, nombre: 'La Libertad' },
    { id: 9, nombre: 'Lima' },
    { id: 10, nombre: 'Loreto' },
    { id: 11, nombre: 'Tacna' }
  ];

  constructor(
    private casoService: CasoService,
    private delitoService: DelitoService,
    private personaRolesVistaService: PersonaRolesVistaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCasos();
    this.loadDelitos();
    console.log('Component initialized');
  }

  // Gestión de pestañas
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Métodos de paginación y filtrado
  onPageChange(event: any): void {
    this.pageNumber = event.offset;
    this.loadCasos();
  }

  onSortChange(event: any): void {
    if (event.sorts && event.sorts.length) {
      this.sortBy = event.sorts[0].prop;
      this.sortDir = event.sorts[0].dir;
      this.loadCasos();
    }
  }

  onSearch(text: string): void {
    this.searchFilter = text;
    this.pageNumber = 0;
    this.loadCasos();
  }

  onFilter(): void {
    this.pageNumber = 0;
    this.loadCasos();
  }

  // Funciones de filtrado y paginación
  filtrarPersonas(): void {
    // Implementar lógica de filtrado
  }

  getPersonasFiltradas(): any[] {
    if (!this.casoDetalle?.personas) return [];
    
    let personasFiltradas = this.casoDetalle.personas;
    
    if (this.filtroPersonas) {
      personasFiltradas = personasFiltradas.filter((persona: any) =>
        persona.nombres?.toLowerCase().includes(this.filtroPersonas.toLowerCase()) ||
        persona.apellidos?.toLowerCase().includes(this.filtroPersonas.toLowerCase()) ||
        persona.numero_documento?.includes(this.filtroPersonas)
      );
    }
    
    if (this.filtroRol) {
      personasFiltradas = personasFiltradas.filter((persona: any) =>
        persona.nombre_rol?.toLowerCase().includes(this.filtroRol.toLowerCase())
      );
    }
    
    return personasFiltradas;
  }

  // Fixed: Added proper type checking and filtering for the roles array
getRolesUnicos(): string[] {
  if (!this.casoDetalle?.personas) return [];
  const roles = this.casoDetalle.personas
    .map((persona: any) => persona.nombre_rol)
    .filter((rol: any): rol is string => Boolean(rol) && typeof rol === 'string');
  return Array.from(new Set<string>(roles));
}

  // Tracking functions
  trackByDelitoId(index: number, delitoId: any): any {
    return delitoId;
  }

  trackByPersonaId(index: number, persona: any): any {
    return persona.id;
  }

  // Contadores
  getTotalDelitos(): number {
    return this.casoDetalle?.delito_id?.length || 0;
  }

  getTotalPersonas(): number {
    return this.casoDetalle?.personas?.length || 0;
  }

  // Carga de datos
  loadCasos(): void {
    const filtro = this.searchFilter.trim();
    let estado = '';
    let codigoCaso = '';

    if (!filtro) {
      estado = this.estadosValidos.join(',');
      codigoCaso = '';
    } else {
      // Coincidencia exacta con estado
      const estadoMatch = this.estadosValidos.find(e =>
        e.toLowerCase() === filtro.toLowerCase()
      );
      if (estadoMatch) {
        estado = estadoMatch;
        codigoCaso = '';
      } else if (/^\d{8}-[A-Z0-9]+$/i.test(filtro)) {
        // Si el usuario solo pone el número de caso, agregamos el prefijo CASO-
        estado = this.estadosValidos.join(',');
        codigoCaso = `CASO-${filtro}`;
      } else if (/^caso-/i.test(filtro) || /\d/.test(filtro)) {
        // Si ya puso CASO- o algo similar
        estado = this.estadosValidos.join(',');
        codigoCaso = filtro;
      } else {
        // Coincidencia parcial con estado
        const estadosParciales = this.estadosValidos.filter(e =>
          e.toLowerCase().includes(filtro.toLowerCase())
        );
        if (estadosParciales.length > 0) {
          estado = estadosParciales.join(',');
          codigoCaso = '';
        } else {
          estado = this.estadosValidos.join(',');
          codigoCaso = filtro;
        }
      }
    }

    this.casoService
      .getCasosByPage(
        this.pageNumber,
        this.pageSize,
        this.sortBy,
        this.sortDir,
        estado,
        codigoCaso
      )
      .subscribe({
        next: (data: any) => {
          this.casos = data.content || [];
          this.totalRows = data.totalElements ?? data.total_elements ?? this.casos.length;
        },
        error: (err: any) => {
          console.error('Error al cargar casos:', err);
          this.casos = [];
          this.totalRows = 0;
          this.toastr.error('Error al cargar los casos', 'Error');
        }
      });
  }

  loadDelitos(): void {
    this.delitoService.getDelitos().subscribe({
      next: (data: any[]) => {
        this.delitosCatalogo = data;
      },
      error: (err: any) => {
        console.error('Error al cargar delitos:', err);
        this.delitosCatalogo = [];
        this.toastr.error('Error al cargar el catálogo de delitos', 'Error');
      }
    });
  }

  // Métodos de utilidad
  limpiarCodigoCaso(codigo: string): string {
    return (codigo && typeof codigo === 'string') ? codigo.replace(/^CASO-/, '') : codigo || '';
  }

  limpiarPersonaIdRol(valor: any): string {
    if (typeof valor !== 'string') valor = String(valor);
    return valor.replace('[', '').replace(']', '');
  }

  getDelitoNombre(dId: number): string {
    const delito = this.delitosCatalogo.find(d => d.id === dId);
    return delito ? delito.nombre : String(dId);
  }

  getDelitoDescripcion(dId: number): string {
    const delito = this.delitosCatalogo.find(d => d.id === dId);
    return delito ? delito.descripcion : 'Descripción no disponible';
  }

  mostrarPersonaRol(valor: string): string {
    valor = valor.replace('[', '').replace(']', '').trim();
    const partes = valor.split(',');
    if (partes.length === 2) {
      return `ID: ${partes[0]}, Rol: ${partes[1]}`;
    }
    return valor;
  }

  getEntidadDescripcion(entidadReceptoraId: number): string {
    const ref = this.entidadesReferencia.find(e => e.id === entidadReceptoraId);
    if (!ref) return entidadReceptoraId + '';
    
    const entidad = this.entidades.find(e => e.id === ref.entidad_id);
    const distrito = this.distritos.find(d => d.id === ref.distrito_id);
    
    if (entidad && distrito) {
      return `${entidad.nombre} ${entidad.tipo_entidad} - ${distrito.nombre.toUpperCase()}`;
    }
    return entidadReceptoraId + '';
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Abierto':
        return 'bg-success text-white';
      case 'En Investigación':
        return 'bg-warning text-dark border border-warning';
      case 'Intermedia':
        return 'bg-info text-dark border border-info';
      case 'Preparatoria':
        return 'bg-primary text-white border border-primary';
      case 'Juicio':
        return 'bg-danger text-white border border-danger';
      case 'Archivado':
        return 'bg-dark text-white border border-dark';
      case 'Reaperturado':
        return 'bg-purple text-white border border-purple';
      case 'Registrado':
        return 'bg-orange text-white border border-orange';
      default:
        return 'bg-light text-dark border';
    }
  }

  // Métodos de modales
  verDetalleDelitos(delitosIds: number[]): void {
    this.modalDetalle = (delitosIds || []).map(id => {
      const delito = this.delitosCatalogo.find(d => d.id === id);
      return delito ? `${delito.nombre}: ${delito.descripcion}` : `ID ${id}`;
    });
    this.modalTitulo = 'Detalle de Delitos';
    this.modalTipo = 'delitos';
    this.abrirModal();
  }

  // MÉTODO EXISTENTE (con botón) - NO CAMBIAR
  verDetallePersonasPorCaso(casoId: number): void {
    this.personaRolesVistaService.getPersonasRolesVistaPorCaso(casoId).subscribe({
      next: (personas: any[]) => {
        this.modalDetalle = personas.map(personaRol => ({
          nombres: personaRol.nombres,
          apellidos: personaRol.apellidos,
          nombreRol: personaRol.nombre_rol,
          tipoDocumento: personaRol.tipo_documento,
          numeroDocumento: personaRol.numero_documento,
          sexo: personaRol.sexo
        }));
        this.modalTitulo = 'Detalle de Personas';
        this.modalTipo = 'personas';
        this.abrirModal();
      },
      error: (err: any) => {
        console.error('Error al cargar personas:', err);
        this.modalDetalle = [];
        this.modalTitulo = 'Detalle de Personas';
        this.modalTipo = 'personas';
        this.abrirModal();
        this.toastr.error('Error al cargar las personas del caso', 'Error');
      }
    });
  }

  // NUEVO MÉTODO - Abrir modal con pestaña de personas automáticamente
  abrirModalPersonasAutomatico(caso: any): void {
    // Cargar el detalle completo del caso
    this.casoService.getCaso(caso.id).subscribe({
      next: (data) => {
        this.casoDetalle = data;
        // Cargar personas asociadas al caso
        this.personaRolesVistaService.getPersonasRolesVistaPorCaso(caso.id).subscribe({
          next: (personas: any[]) => {
            this.casoDetalle.personas = personas;
            // Abrir modal y activar pestaña de personas
            setTimeout(() => {
              this.abrirModalDetalleCaso();
              // Activar automáticamente la pestaña de personas después de un breve delay
              setTimeout(() => {
                this.activarPestanaPersonas();
              }, 200);
            }, 100);
          },
          error: (err: any) => {
            console.error('Error al cargar personas del caso:', err);
            this.casoDetalle.personas = [];
            this.abrirModalDetalleCaso();
            // Activar pestaña de personas incluso si hay error
            setTimeout(() => {
              this.activarPestanaPersonas();
            }, 200);
          }
        });
      },
      error: (err: any) => {
        console.error('Error al cargar detalle del caso:', err);
        this.casoDetalle = null;
        this.toastr.error('No se pudo cargar el detalle del caso.', 'Error');
      }
    });
  }

  // Método auxiliar para activar la pestaña de personas
  private activarPestanaPersonas(): void {
    try {
      const personasTab = document.getElementById('personas-tab');
      if (personasTab) {
        personasTab.click();
      }
    } catch (error) {
      console.error('Error al activar pestaña de personas:', error);
    }
  }

 verDetalleCaso(id: number): void {
    this.casoService.getCaso(id).subscribe({
      next: (data) => {
        this.casoDetalle = data;
        this.pdfSrc = 'assets/pdfs/caso-' + id + '.pdf';
        
        // Generar código QR
        this.codigoQR = `http://localhost:4200/casos`;
        this.generateQRCode(this.codigoQR);
        
        // Cargar personas asociadas al caso
        this.personaRolesVistaService.getPersonasRolesVistaPorCaso(id).subscribe({
          next: (personas: any[]) => {
            this.casoDetalle.personas = personas;
            setTimeout(() => {
              this.abrirModalDetalleCaso();
            }, 100);
          },
          error: (err: any) => {
            console.error('Error al cargar personas del caso:', err);
            this.casoDetalle.personas = [];
            this.abrirModalDetalleCaso();
          }
        });
      },
      error: (err: any) => {
        console.error('Error al cargar detalle del caso:', err);
        this.casoDetalle = null;
        this.toastr.error('No se pudo cargar el detalle del caso.', 'Error');
      }
    });
  }

  verDetallePersonaIndividual(persona: any): void {
    this.modalDetalle = [{
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      nombreRol: persona.nombreRol,
      tipoDocumento: persona.tipoDocumento,
      numeroDocumento: persona.numeroDocumento,
      sexo: persona.sexo
    }];
    this.modalTitulo = 'Detalle de Persona';
    this.modalTipo = 'personas';
    this.abrirModal();
  }

  abrirModal(): void {
    try {
      const modalElement = document.getElementById('detalleModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    } catch (error) {
      console.error('Error al abrir modal:', error);
    }
  }

  abrirModalDetalleCaso(): void {
    try {
      const modalElement = document.getElementById('detalleCasoModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    } catch (error) {
      console.error('Error al abrir modal de detalle:', error);
    }
  }

  // Métodos para actualizar estado
  openUpdateEstadoModal(row: any): void {
    this.casoSeleccionado = row;
    try {
      const modalElement = document.getElementById('updateEstadoModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    } catch (error) {
      console.error('Error al abrir modal de actualización:', error);
    }
  }

  confirmarActualizarEstado(forzarArchivado: boolean): void {
    const casoId = this.casoSeleccionado?.id;
    if (!casoId) {
      this.toastr.error('No se ha seleccionado un caso válido', 'Error');
      return;
    }

    this.casoService.actualizarEstado(`http://localhost:8080/api/generales/casos/${casoId}/actualizar-estado?forzarArchivado=${forzarArchivado}`)
      .subscribe({
        next: () => {
          this.cerrarModal('updateEstadoModal');
          this.loadCasos();
          if (forzarArchivado) {
            this.toastr.success('El caso fue archivado correctamente.', 'Estado actualizado');
          } else {
            this.toastr.success('El caso cambió al siguiente estado.', 'Estado actualizado');
          }
          this.casoSeleccionado = null;
        },
        error: (err: any) => {
          this.cerrarModal('updateEstadoModal');
          this.toastr.error(
            err?.error?.message || err?.message || 'No se pudo actualizar el estado del caso.',
            'Error'
          );
          this.casoSeleccionado = null;
          console.error('Error al actualizar estado:', err);
        }
      });
  }


  // Métodos para eliminar
  openDeleteModal(row: any): void {
    this.casoSeleccionado = row;
    try {
      const modalElement = document.getElementById('deleteCasoModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    } catch (error) {
      console.error('Error al abrir modal de eliminación:', error);
    }
  }

  confirmDeleteCaso(): void {
    if (!this.casoSeleccionado) {
      this.toastr.error('No se ha seleccionado un caso válido', 'Error');
      return;
    }

    this.casoService.delete(this.casoSeleccionado.id).subscribe({
      next: () => {
        this.loadCasos();
        this.casoSeleccionado = null;
        this.cerrarModal('deleteCasoModal');
        this.toastr.success('Caso eliminado correctamente', 'Éxito');
      },
      error: (err: any) => {
        this.casoSeleccionado = null;
        this.cerrarModal('deleteCasoModal');
        this.toastr.error('No se pudo eliminar el caso.', 'Error');
        console.error('Error al eliminar caso:', err);
      }
    });
  }



// imprmir detalle del caso

imprimirDetalleCaso(): void {
  if (!this.casoDetalle) {
    console.error('No hay detalles del caso para imprimir');
    return;
  }

  // Crear ventana para impresión
  const ventanaImpresion = window.open('', '_blank', 'width=800,height=600');
  
  if (!ventanaImpresion) {
    console.error('No se pudo abrir la ventana de impresión');
    return;
  }

  // Obtener delitos asociados
  const delitosHTML = this.casoDetalle.delito_id?.map((delitoId: any, index: number) => 
    `<tr class="${index % 2 === 0 ? 'row-even' : 'row-odd'}">
      <td class="numero-celda">${index + 1}</td>
      <td class="delito-nombre">${this.getDelitoNombre(delitoId)}</td>
      <td class="delito-desc">${this.getDelitoDescripcion(delitoId)}</td>
    </tr>`
  ).join('') || '<tr><td colspan="3" class="no-datos">No hay delitos asociados</td></tr>';

  // Obtener personas asociadas
  const personasHTML = this.casoDetalle.personas?.map((persona: any, index: number) => 
    `<tr class="${index % 2 === 0 ? 'row-even' : 'row-odd'}">
      <td class="numero-celda">${index + 1}</td>
      <td class="persona-nombre">${persona.nombres} ${persona.apellidos}</td>
      <td class="persona-rol">${persona.nombreRol || persona.nombre_rol}</td>
      <td class="persona-doc">${persona.tipoDocumento || persona.tipo_documento}: ${persona.numeroDocumento || persona.numero_documento}</td>
      <td class="persona-sexo">${persona.sexo}</td>
    </tr>`
  ).join('') || '<tr><td colspan="5" class="no-datos">No hay personas asociadas</td></tr>';

  // Obtener tabla de roles y personas
  const rolesPersonasHTML = this.casoDetalle.personas?.map((persona: any, index: number) => 
    `<tr class="${index % 2 === 0 ? 'row-even' : 'row-odd'}">
      <td class="numero-celda">${index + 1}</td>
      <td class="nombre-simple">${persona.nombres}</td>
      <td class="apellido-simple">${persona.apellidos}</td>
      <td class="rol-simple">${persona.nombreRol || persona.nombre_rol}</td>
    </tr>`
  ).join('') || '<tr><td colspan="4" class="no-datos">No hay personas con roles</td></tr>';

  // HTML completo para impresión con diseño profesional
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Detalle del Caso</title>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 11px;
          line-height: 1.4;
          background: #f8fafc;
          color: #2d3748;
          padding: 15px;
        }
        
        .container {
          max-width: 100%;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .header-principal {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          text-align: center;
          padding: 20px 15px;
        }
        
        .titulo-principal {
          font-size: 18px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        
        .subtitulo {
          font-size: 12px;
          opacity: 0.9;
          font-weight: 400;
        }
        
        .content-wrapper {
          padding: 20px;
        }
        
        .seccion {
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
          page-break-inside: avoid;
        }
        
        .seccion-header {
          background: #f1f5f9;
          border-bottom: 1px solid #cbd5e0;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 600;
          color: #1e40af;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .seccion-body {
          padding: 15px;
          background: white;
        }
        
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 0;
        }
        
        .info-table tr {
          border-bottom: 1px solid #f1f5f9;
        }
        
        .info-table tr:last-child {
          border-bottom: none;
        }
        
        .info-table th {
          width: 30%;
          font-weight: 600;
          font-size: 11px;
          padding: 8px 10px;
          text-align: left;
          background: #f8fafc;
          border-right: 2px solid #1e40af;
          color: #374151;
        }
        
        .info-table td {
          font-size: 11px;
          padding: 8px 10px;
          text-align: left;
          background: white;
          color: #374151;
          font-weight: 500;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          border: 1px solid #cbd5e0;
        }
        
        .data-table th {
          background: #1e40af;
          color: white;
          border: 1px solid #1e3a8a;
          padding: 8px 6px;
          font-size: 11px;
          font-weight: 600;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        
        .data-table td {
          border: 1px solid #e2e8f0;
          padding: 6px 8px;
          font-size: 10px;
          text-align: center;
          vertical-align: middle;
        }
        
        .row-even {
          background: #f8fafc;
        }
        
        .row-odd {
          background: white;
        }
        
        .numero-celda {
          background: #1e40af !important;
          color: white !important;
          font-weight: 600 !important;
          width: 40px !important;
          text-align: center !important;
        }
        
        .delito-nombre {
          color: #1f2937 !important;
          font-weight: 600 !important;
          text-align: left !important;
        }
        
        .delito-desc {
          color: #4b5563 !important;
          font-style: italic;
          text-align: left !important;
          font-size: 10px !important;
        }
        
        .persona-nombre {
          color: #1f2937 !important;
          font-weight: 600 !important;
          text-align: left !important;
        }
        
        .persona-rol {
          background: #e0f2fe !important;
          color: #0369a1 !important;
          font-weight: 500 !important;
          border-radius: 4px !important;
          padding: 2px 6px !important;
          font-size: 10px !important;
        }
        
        .persona-doc {
          color: #374151 !important;
          font-family: 'Courier New', monospace;
          font-size: 10px !important;
        }
        
        .persona-sexo {
          color: #374151 !important;
          font-weight: 500 !important;
        }
        
        .nombre-simple {
          color: #1f2937 !important;
          font-weight: 500 !important;
          text-align: left !important;
        }
        
        .apellido-simple {
          color: #1f2937 !important;
          font-weight: 500 !important;
          text-align: left !important;
        }
        
        .rol-simple {
          background: #dbeafe !important;
          color: #1e40af !important;
          font-weight: 500 !important;
          border-radius: 4px !important;
          padding: 2px 6px !important;
          font-size: 10px !important;
        }
        
        .no-datos {
          text-align: center !important;
          font-style: italic !important;
          color: #6b7280 !important;
          padding: 15px !important;
          background: #f9fafb !important;
          font-size: 11px !important;
        }
        
        .estado-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          background: #059669;
          color: white;
        }
        
        .codigo-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          background: #374151;
          color: white;
          letter-spacing: 0.5px;
        }
        
        .fecha-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          background: #1e40af;
          color: white;
        }
        
        .qr-section {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          background: #f8fafc;
          margin-top: 10px;
        }
        
        .qr-container-print {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .qr-info {
          flex: 1;
        }
        
        .qr-image-container {
          text-align: center;
          min-width: 120px;
        }
        
        .qr-code-img {
          width: 100px;
          height: 100px;
          border: 2px solid #1e40af;
          border-radius: 8px;
          padding: 5px;
          background: white;
        }
        
        .qr-fallback {
          width: 100px;
          height: 100px;
          border: 2px dashed #cbd5e0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          color: #6b7280;
          font-size: 10px;
          text-align: center;
        }
        
        .qr-caption {
          font-size: 8px;
          color: #6b7280;
          margin-top: 5px;
          text-align: center;
          line-height: 1.2;
        }
        
        @media print {
          body { 
            margin: 0; 
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page { 
            margin: 1.2cm; 
            size: A4 portrait; 
          }
          .container {
            box-shadow: none;
          }
          .seccion {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header-principal">
          <div class="titulo-principal">Detalle del Caso</div>
          <div class="subtitulo">Reporte del Sistema de Gestión de Casos</div>
        </div>
        
        <div class="content-wrapper">
          <!-- Información General -->
          <div class="seccion">
            <div class="seccion-header">Información General</div>
            <div class="seccion-body">
              <table class="info-table">
                <tr>
                  <th>ID del Caso:</th>
                  <td><span class="codigo-badge">${this.casoDetalle.id}</span></td>
                </tr>
                <tr>
                  <th>Código:</th>
                  <td><span class="codigo-badge">${this.limpiarCodigoCaso(this.casoDetalle.codigo_caso)}</span></td>
                </tr>
                <tr>
                  <th>Estado:</th>
                  <td><span class="estado-badge">${this.casoDetalle.estado}</span></td>
                </tr>
                <tr>
                  <th>Fecha:</th>
                  <td><span class="fecha-badge">${new Date(this.casoDetalle.fecha_caso).toLocaleDateString('es-ES')}</span></td>
                </tr>
                <tr>
                  <th>Entidad Receptora:</th>
                  <td>${this.getEntidadDescripcion(this.casoDetalle.entidad_receptora_id)}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <!-- Delitos Asociados -->
          <div class="seccion">
            <div class="seccion-header">Delitos Asociados</div>
            <div class="seccion-body">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tipo de Delito</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  ${delitosHTML}
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Personas Asociadas -->
          <div class="seccion">
            <div class="seccion-header">Personas Asociadas</div>
            <div class="seccion-body">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre Completo</th>
                    <th>Rol</th>
                    <th>Documento</th>
                    <th>Sexo</th>
                  </tr>
                </thead>
                <tbody>
                  ${personasHTML}
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Resumen de Roles -->
          <div class="seccion">
            <div class="seccion-header">⚖️ Resumen de Roles</div>
            <div class="seccion-body">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Rol Asignado</th>
                  </tr>
                </thead>
                <tbody>
                  ${rolesPersonasHTML}
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Código QR del Caso -->
          <div class="seccion">
            <div class="seccion-header">📱 Código QR del Caso</div>
            <div class="seccion-body">
              <div style="display: flex; align-items: center; gap: 20px;">
                <div style="flex: 1;">
                  <table class="info-table">
                    <tr>
                      <th>URL del Caso:</th>
                      <td style="word-break: break-all; font-family: monospace; font-size: 10px;">${this.codigoQR}</td>
                    </tr>
                    <tr>
                      <th>Acceso Directo:</th>
                      <td>Escanea el código QR para acceder al caso desde tu dispositivo móvil</td>
                    </tr>
                    <tr>
                      <th>Generado:</th>
                      <td>${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</td>
                    </tr>
                  </table>
                </div>
                <div style="text-align: center; min-width: 120px;">
                  ${this.qrCodeDataURL ? 
                    `<img src="${this.qrCodeDataURL}" alt="Código QR del caso" style="width: 100px; height: 100px; border: 2px solid #1e40af; border-radius: 8px; padding: 5px; background: white;" />
                     <div style="font-size: 8px; color: #6b7280; margin-top: 5px; text-align: center;">
                       <strong>Código QR</strong><br>
                       Caso: ${this.limpiarCodigoCaso(this.casoDetalle.codigo_caso)}
                     </div>` : 
                    `<div style="width: 100px; height: 100px; border: 2px dashed #cbd5e0; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #f9fafb; color: #6b7280; font-size: 10px; text-align: center;">
                       QR no<br>disponible
                     </div>`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Escribir contenido y preparar para impresión
  ventanaImpresion.document.write(htmlContent);
  ventanaImpresion.document.close();
  
  // Esperar a que cargue e imprimir
  ventanaImpresion.onload = () => {
    setTimeout(() => {
      ventanaImpresion.print();
      ventanaImpresion.close();
    }, 1000);
  };
}



  // Método auxiliar para cerrar modales
  private cerrarModal(modalId: string): void {
    try {
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    } catch (error) {
      console.error(`Error al cerrar modal ${modalId}:`, error);
    }
  }
}


