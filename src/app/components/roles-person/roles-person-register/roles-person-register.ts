import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RolesPersonService } from '../../../shared/services/roles-person.service';
import { forkJoin } from 'rxjs';

interface RolesPersonResponse {
  id: number;
  caso_id: number;
  persona_id: number;
  rol_id: number;
}

// 🆕 Interfaces para datos enriquecidos
interface PersonaDetail {
  id: number;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string;
  sexo: string;
}

interface RolDetail {
  id: number;
  nombre: string;
}

interface CasoDetail {
  id: number;
  codigo_caso: string;
  entidad_receptora_id: number;
  fecha_caso: string;
  estado: string;
  delito_id: number[];
}

@Component({
  selector: 'app-roles-person-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roles-person-register.html',
  providers: [ToastrService]
})
export class RolesPersonRegister implements OnInit {
  
  rolesPersonForm: FormGroup;
  isEditMode = false;
  rolesPersonId: number | null = null;
  isLoading = false;
  
  // 🆕 Propiedades para datos enriquecidos
  personaDetail: PersonaDetail | null = null;
  rolDetail: RolDetail | null = null;
  casoDetail: CasoDetail | null = null;
  
  // 🆕 Propiedades para mostrar texto enriquecido
  displayData = {
    personaDisplay: '',
    rolDisplay: '',
    casoDisplay: ''
  };
  
  // 🆕 Roles disponibles para actualización
  availableRoles = [
    { id: 7, nombre: 'Agraviado' },
    { id: 9, nombre: 'Investigado' },
    { id: 11, nombre: 'Procesado' },
    { id: 16, nombre: 'Reo contumaz' },
    { id: 17, nombre: 'Imputado' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rolesPersonService: RolesPersonService,
    private toastr: ToastrService
  ) {
    this.rolesPersonForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      persona_id: ['', [Validators.required, Validators.min(1)]],
      rol_id: ['', [Validators.required, this.validateRoleSelection.bind(this)]],
      caso_id: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // 🔍 Detectar si es modo edición basándose en la ruta
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.rolesPersonId = +params['id'];
        this.isEditMode = true;
        this.configureFormForEdit();
        this.loadRolesPersonData();
      }
    });
  }

  // 🆕 Configurar formulario para modo edición
  configureFormForEdit(): void {
    if (this.isEditMode) {
      // En modo edición, deshabilitar persona_id y caso_id
      this.rolesPersonForm.get('persona_id')?.disable();
      this.rolesPersonForm.get('caso_id')?.disable();
      
      // Solo el rol_id queda habilitado para edición
      this.rolesPersonForm.get('rol_id')?.enable();
      
      console.log('Formulario configurado para modo edición: solo rol_id habilitado');
    }
  }

  loadSampleData(): void {
    this.rolesPersonForm.patchValue({
      persona_id: 279,
      rol_id: 7,
      caso_id: 537
    });
    this.toastr.info('Datos de ejemplo cargados');
  }

  loadRolesPersonData(): void {
    if (this.rolesPersonId) {
      this.isLoading = true;
      this.rolesPersonService.getRolesPersonCasoByPageAndId(0, 1, 'id', 'asc', this.rolesPersonId)
        .subscribe({
          next: (response: any) => {
            console.log('Respuesta del servidor:', response);
            if (response?.content && response.content.length > 0) {
              const data: RolesPersonResponse = response.content[0];
              console.log('Datos a cargar:', data);
              
              // 🔄 Cargar datos básicos al formulario
              this.rolesPersonForm.patchValue({
                id: data.id,
                persona_id: data.persona_id,
                rol_id: data.rol_id,
                caso_id: data.caso_id
              });
              
              // 🔄 Cargar detalles enriquecidos
              this.loadEnrichedData(data);
              
              this.toastr.success('Datos cargados exitosamente');
            } else {
              this.toastr.error('No se encontró el registro');
              this.router.navigate(['/rolesperson']);
            }
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error loading roles person data:', error);
            this.toastr.error('Error al cargar los datos');
            this.isLoading = false;
          }
        });
    }
  }

  // 🆕 Método para cargar datos enriquecidos
  loadEnrichedData(data: RolesPersonResponse): void {
    console.log('Cargando datos enriquecidos para:', data);
    
    // 🔄 Usar forkJoin para hacer las 3 peticiones simultáneamente
    forkJoin({
      persona: this.rolesPersonService.getPersonaById(data.persona_id),
      rol: this.rolesPersonService.getRolById(data.rol_id),
      caso: this.rolesPersonService.getCasoById(data.caso_id)
    }).subscribe({
      next: (results) => {
        console.log('Datos enriquecidos cargados:', results);
        
        // 📄 Guardar los detalles
        this.personaDetail = results.persona;
        this.rolDetail = results.rol;
        this.casoDetail = results.caso;
        
        // 🎨 Actualizar los displays
        this.updateDisplayData();
      },
      error: (error) => {
        console.error('Error al cargar datos enriquecidos:', error);
        this.toastr.warning('Algunos datos adicionales no se pudieron cargar');
      }
    });
  }

  // 🆕 Método para actualizar los textos de display
  updateDisplayData(): void {
    // 👤 Formato para persona: "Nombres Apellidos"
    this.displayData.personaDisplay = this.personaDetail 
      ? `${this.personaDetail.nombres} ${this.personaDetail.apellidos}`
      : 'Cargando...';
    
    // 🛡️ Formato para rol: "Nombre del Rol"
    this.displayData.rolDisplay = this.rolDetail 
      ? this.rolDetail.nombre
      : 'Cargando...';
    
    // 📁 Formato para caso: "Código del Caso"
    this.displayData.casoDisplay = this.casoDetail 
      ? this.casoDetail.codigo_caso
      : 'Cargando...';
    
    console.log('Display data actualizada:', this.displayData);
  }

  // 🆕 Método para obtener información adicional de persona
  getPersonaInfo(): string {
    if (!this.personaDetail) return '';
    return `${this.personaDetail.tipo_documento}: ${this.personaDetail.numero_documento}`;
  }

  // 🆕 Método para obtener información adicional de caso
  getCasoInfo(): string {
    if (!this.casoDetail) return '';
    return `Estado: ${this.casoDetail.estado} | Fecha: ${this.casoDetail.fecha_caso}`;
  }

  // 🆕 Método para obtener el nombre del rol por ID
  getRolNameById(rolId: number): string {
    const role = this.availableRoles.find(r => r.id === rolId);
    return role ? role.nombre : 'Desconocido';
  }

  // 🆕 Método para verificar si un rol está permitido
  isRoleAllowed(rolId: number): boolean {
    return this.availableRoles.some(role => role.id === rolId);
  }

  // 🆕 Validador personalizado para roles
  validateRoleSelection(control: any) {
    const value = control.value;
    if (!value) {
      return null; // Si no hay valor, lo maneja el validador required
    }
    
    const isValid = this.availableRoles.some(role => role.id === parseInt(value));
    return isValid ? null : { invalidRole: true };
  }

  onSubmit(): void {
    if (this.rolesPersonForm.valid) {
      const formData = this.rolesPersonForm.getRawValue();
      
      // 🔍 Validar que el rol seleccionado esté en la lista de roles permitidos
      const selectedRolId = parseInt(formData.rol_id);
      const isValidRole = this.availableRoles.some(role => role.id === selectedRolId);
      
      if (!isValidRole || isNaN(selectedRolId)) {
        this.toastr.error('El rol seleccionado no está permitido para actualización');
        return;
      }
      
      if (this.isEditMode && this.rolesPersonId) {
        // 🔄 Actualizar registro existente
        this.isLoading = true;
        
        // En modo edición, preparar datos en el formato requerido por el backend
        const updateData = {
          casoId: parseInt(this.rolesPersonForm.get('caso_id')?.value),
          personaId: parseInt(this.rolesPersonForm.get('persona_id')?.value),
          rolId: selectedRolId // Ya es número entero
        };
        
        console.log('Datos a actualizar (formato backend):', updateData);
        console.log(`Endpoint: http://localhost:8080/rolespersonacaso/${this.rolesPersonId}`);
        console.log('Rol seleccionado ID:', selectedRolId, 'tipo:', typeof selectedRolId);
        
        this.rolesPersonService.updateRolesPersonCaso(this.rolesPersonId, updateData)
          .subscribe({
            next: (response: any) => {
              console.log('Respuesta de actualización:', response);
              this.toastr.success('Rol actualizado exitosamente');
              this.router.navigate(['/rolesperson']);
              this.isLoading = false;
            },
            error: (error: any) => {
              console.error('Error al actualizar:', error);
              this.toastr.error('Error al actualizar el rol');
              this.isLoading = false;
            }
          });
      } else {
        // 🚫 Si no está en modo edición, mostrar error
        this.toastr.error('No se puede procesar la solicitud');
        console.error('Intento de actualización sin ID válido');
      }
    } else {
      // 📋 Formulario inválido
      this.toastr.error('Por favor, complete todos los campos requeridos');
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    // 🔙 Regresar a la lista de roles persona
    this.router.navigate(['/rolesperson']);
  }

  // 🔧 Método auxiliar para marcar todos los campos como tocados
  private markFormGroupTouched(): void {
    Object.keys(this.rolesPersonForm.controls).forEach(key => {
      const control = this.rolesPersonForm.get(key);
      control?.markAsTouched();
    });
  }

  // 🔧 Getters para validaciones
  get persona_id() { return this.rolesPersonForm.get('persona_id'); }
  get rol_id() { return this.rolesPersonForm.get('rol_id'); }
  get caso_id() { return this.rolesPersonForm.get('caso_id'); }
}