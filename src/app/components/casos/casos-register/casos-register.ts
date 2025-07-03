import { Component, inject, OnInit } from '@angular/core';
import { CasoService } from '../../../shared/services/caso.service';
import { CasoCompletoRequest, PersonaConRolRequest } from '../../../shared/models/request/insertarcaso.request';
import { CasoCompletoResponse } from '../../../shared/models/response/insertarcaso.response';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-casos-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './casos-register.html',
  styleUrls: ['./casos-register.scss']
})
export class CasosRegister implements OnInit {
  private readonly casoService = inject(CasoService);
  private readonly router = inject(Router);
  
  // Control de pasos del formulario
  currentStep = 1;
  totalSteps = 4;
  
  // Estados para el componente
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Datos del formulario
  selectedDistrito: any = null;
  selectedDelitos: any[] = [];
  personas: PersonaConRolRequest[] = [];
  
  // Datos para los dropdowns
  distritos: any[] = [];
  delitos: any[] = [];
  roles: any[] = [];
  
  // Filtros para búsqueda
  filtroDistrito = '';
  filtroDelito = '';
  filtroRol = '';
  
  // Aliases para el HTML (mantener compatibilidad)
  searchDistrito = '';
  searchDelito = '';
  
  // Lista de roles para el HTML
  rolesList: any[] = [];
  
  // Datos filtrados
  distritosFiltrados: any[] = [];
  delitosFiltrados: any[] = [];
  rolesFiltrados: any[] = [];
  
  // Datos para nueva persona
  nuevaPersona: PersonaConRolRequest = {
    nombres: '',
    apellidos: '',
    tipo_documento: 'DNI',
    numero_documento: '',
    fecha_nacimiento: '',
    sexo: 'M',
    roles: []
  };
  
  // Opciones estáticas
  tiposDocumento = [
    { value: 'DNI', label: 'DNI' },
    { value: 'RUC', label: 'RUC' },
    { value: 'CE', label: 'Carnet de Extranjería' }
  ];
  
  sexos = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
  ];
  
  // Control del modal
  showModal = false;
  casoRegistrado: CasoCompletoResponse | null = null;

  ngOnInit(): void {
    // Initialize with 2 empty persons
    this.personas = [this.createNewPersona(), this.createNewPersona()];
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.isLoading = true;
    
    
    // Cargar distritos
    this.casoService.getEntidadesDistrito().subscribe({
      next: (data_) => {
        let data: any[] = [
            {
                "id": 4,
                "nombre": "Ancash",
                "estado": true
            },
            {
                "id": 5,
                "nombre": "Ayacucho",
                "estado": true
            },
            {
                "id": 6,
                "nombre": "Cuzco",
                "estado": true
            },
            {
                "id": 7,
                "nombre": "Junín",
                "estado": true
            },
            {
                "id": 8,
                "nombre": "La Libertad",
                "estado": true
            },
            {
                "id": 9,
                "nombre": "Lima",
                "estado": true
            },
            {
                "id": 10,
                "nombre": "Loreto",
                "estado": true
            },
            {
                "id": 11,
                "nombre": "Tacna",
                "estado": true
            }
        ];

        this.distritos = data_;
        this.distritosFiltrados = [...data];
      },
      error: (error) => console.error('Error cargando distritos:', error)
    });
    
    // Cargar delitos
    this.casoService.getDelitos().subscribe({
      next: (data) => {
        this.delitos = data;
        this.delitosFiltrados = [...data];
      },
      error: (error) => console.error('Error cargando delitos:', error)
    });
    
    // Cargar roles
    this.casoService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.rolesList = [...data]; // Populate rolesList for HTML
        this.rolesFiltrados = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando roles:', error);
        this.isLoading = false;
      }
    });
  }

  // Métodos de filtrado
  filtrarDistritos(): void {
    const searchTerm = this.searchDistrito || this.filtroDistrito;
    if (!searchTerm) {
      this.distritosFiltrados = [...this.distritos];
    } else {
      this.distritosFiltrados = this.distritos.filter(distrito =>
        distrito.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (distrito.descripcion && distrito.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  }

  filtrarDelitos(): void {
    const searchTerm = this.searchDelito || this.filtroDelito;
    if (!searchTerm) {
      this.delitosFiltrados = [...this.delitos];
    } else {
      this.delitosFiltrados = this.delitos.filter(delito =>
        delito.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (delito.descripcion && delito.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  }

  filtrarRoles(): void {
    if (!this.filtroRol) {
      this.rolesFiltrados = [...this.roles];
    } else {
      this.rolesFiltrados = this.roles.filter(rol =>
        rol.nombre.toLowerCase().includes(this.filtroRol.toLowerCase()) ||
        (rol.descripcion && rol.descripcion.toLowerCase().includes(this.filtroRol.toLowerCase()))
      );
    }
  }

  // Navegación entre pasos
  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
      this.clearMessages();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.clearMessages();
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.validateStepsUpTo(step - 1)) {
      this.currentStep = step;
      this.clearMessages();
    }
  }

  // Validaciones
  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validateDistrito();
      case 2:
        return this.validateDelitos();
      case 3:
        return this.validatePersonas();
      case 4:
        return true; // Paso de confirmación
      default:
        return false;
    }
  }

  validateStepsUpTo(step: number): boolean {
    for (let i = 1; i <= step; i++) {
      const currentStepBackup = this.currentStep;
      this.currentStep = i;
      if (!this.validateCurrentStep()) {
        this.currentStep = currentStepBackup;
        return false;
      }
    }
    return true;
  }

  validateDistrito(): boolean {
    if (!this.selectedDistrito) {
      this.errorMessage = 'Debe seleccionar un distrito';
      return false;
    }
    return true;
  }

  validateDelitos(): boolean {
    if (this.selectedDelitos.length === 0) {
      this.errorMessage = 'Debe seleccionar al menos un delito';
      return false;
    }
    return true;
  }

  validatePersonas(): boolean {
    if (this.personas.length < 2) {
      this.errorMessage = 'Debe agregar al menos 2 personas';
      return false;
    }
    return true;
  }

  // Nuevos métodos para el diseño espectacular
  seleccionarDistrito(distrito: any): void {
    this.selectedDistrito = distrito.id;
    this.clearMessages();
    
    // Auto-avanzar al siguiente paso después de seleccionar
    setTimeout(() => {
      if (this.validateCurrentStep()) {
        this.nextStep();
      }
    }, 500);
  }

  toggleDelito(delito: any): void {
    const index = this.selectedDelitos.findIndex(d => d.id === delito.id);
    if (index > -1) {
      this.selectedDelitos.splice(index, 1);
    } else {
      this.selectedDelitos.push(delito);
    }
    this.clearMessages();
  }

  limpiarDelitos(): void {
    this.selectedDelitos = [];
    this.clearMessages();
  }

  toggleRolForNewPerson(rol: any): void {
    const index = this.nuevaPersona.roles.indexOf(rol.id);
    if (index > -1) {
      this.nuevaPersona.roles.splice(index, 1);
    } else {
      this.nuevaPersona.roles.push(rol.id);
    }
  }

  isRolSelectedForNewPerson(rolId: number): boolean {
    return this.nuevaPersona.roles.includes(rolId);
  }

  isValidNewPerson(): boolean {
    return this.nuevaPersona.nombres.trim() !== '' &&
           this.nuevaPersona.apellidos.trim() !== '' &&
           this.nuevaPersona.numero_documento.trim() !== '' &&
           this.nuevaPersona.fecha_nacimiento !== '' &&
           this.nuevaPersona.roles.length > 0 &&
           this.validateNumeroDocumento();
  }

  getSexoLabel(sexo: string): string {
    const sexoObj = this.sexos.find(s => s.value === sexo);
    return sexoObj ? sexoObj.label : sexo;
  }

  getDistritoCodigo(distritoId: number | null): string {
    if (!distritoId) return 'N/A';
    const distrito = this.distritos.find(d => d.id === distritoId);
    return distrito ? distrito.codigo || 'N/A' : 'N/A';
  }

  canProceedToNextStep(): boolean {
    return this.validateCurrentStep();
  }

  canRegisterCase(): boolean {
    return this.selectedDistrito !== null &&
           this.selectedDelitos.length > 0 &&
           this.personas.length >= 2;
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.clearMessages();
    }
  }



  isDelitoSelected(delito: any): boolean {
    return this.selectedDelitos.some(d => d.id === delito.id);
  }

  // Manejo de personas
  agregarPersona(): void {
    if (this.validateNuevaPersona()) {
      this.personas.push({ ...this.nuevaPersona });
      this.resetNuevaPersona();
      this.clearMessages();
    }
  }

  eliminarPersona(index: number): void {
    this.personas.splice(index, 1);
  }

  validateNuevaPersona(): boolean {
    if (!this.nuevaPersona.nombres.trim()) {
      this.errorMessage = 'Los nombres son obligatorios';
      return false;
    }
    if (!this.nuevaPersona.apellidos.trim()) {
      this.errorMessage = 'Los apellidos son obligatorios';
      return false;
    }
    if (!this.nuevaPersona.numero_documento.trim()) {
      this.errorMessage = 'El número de documento es obligatorio';
      return false;
    }
    if (!this.validateNumeroDocumento()) {
      return false;
    }
    if (!this.nuevaPersona.fecha_nacimiento) {
      this.errorMessage = 'La fecha de nacimiento es obligatoria';
      return false;
    }
    if (this.nuevaPersona.roles.length === 0) {
      this.errorMessage = 'Debe seleccionar al menos un rol para la persona';
      return false;
    }
    return true;
  }

  validateNumeroDocumento(): boolean {
    const numero = this.nuevaPersona.numero_documento.trim();
    const tipo = this.nuevaPersona.tipo_documento;
    
    if (!numero) {
      this.errorMessage = 'El número de documento es obligatorio';
      return false;
    }
    
    if (!/^\d+$/.test(numero)) {
      this.errorMessage = 'El número de documento solo debe contener dígitos';
      return false;
    }
    
    if (tipo === 'DNI' && numero.length !== 8) {
      this.errorMessage = 'El DNI debe tener exactamente 8 dígitos';
      return false;
    }
    
    if (tipo === 'RUC' && numero.length !== 11) {
      this.errorMessage = 'El RUC debe tener exactamente 11 dígitos';
      return false;
    }
    
    if (tipo === 'CE' && (numero.length < 8 || numero.length > 12)) {
      this.errorMessage = 'El Carnet de Extranjería debe tener entre 8 y 12 dígitos';
      return false;
    }
    
    // Verificar que no haya duplicados
    const existeDocumento = this.personas.some(persona => 
      persona.numero_documento === numero && persona.tipo_documento === tipo
    );
    
    if (existeDocumento) {
      this.errorMessage = `Ya existe una persona con este ${tipo}: ${numero}`;
      return false;
    }
    
    return true;
  }

  resetNuevaPersona(): void {
    this.nuevaPersona = {
      nombres: '',
      apellidos: '',
      tipo_documento: 'DNI',
      numero_documento: '',
      fecha_nacimiento: '',
      sexo: 'M',
      roles: []
    };
  }

  // Manejo de roles para personas
  toggleRolPersona(persona: PersonaConRolRequest, rol: any): void {
    const index = persona.roles.indexOf(rol.id);
    if (index > -1) {
      persona.roles.splice(index, 1);
    } else {
      persona.roles.push(rol.id);
    }
  }

  isRolSelected(persona: PersonaConRolRequest, rol: any): boolean {
    return persona.roles.includes(rol.id);
  }

  getRoleName(idRol: number): string {
    const rol = this.rolesList.find(r => r.id === idRol);
    return rol ? rol.nombre : 'Rol desconocido';
  }

  getDistritoName(): string {
    return this.selectedDistrito ? this.selectedDistrito.nombre : 'Desconocido';
  }

  // Función principal para insertar caso
  insertarCaso(): void {
    if (!this.canRegisterCase()) {
      return;
    }

    const caso: CasoCompletoRequest = {
      id_entidad_distrito: this.selectedDistrito.id,
      delitos: this.selectedDelitos.map(d => d.id),
      personas: this.personas
    };

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.casoService.insertarCaso(caso).subscribe({
      next: (response: CasoCompletoResponse) => {
        this.isLoading = false;
        // Manejar tanto array como objeto simple
        if (Array.isArray(response) && response.length > 0) {
          this.casoRegistrado = response[0];
        } else if (!Array.isArray(response)) {
          this.casoRegistrado = response;
        } else {
          this.casoRegistrado = null;
        }
        
        this.showModal = true;
        this.successMessage = `Caso registrado exitosamente con código: ${this.casoRegistrado?.codigo_caso || 'N/A'}`;
        console.log('Caso insertado exitosamente:', response);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al insertar el caso. Por favor, intente nuevamente.';
        console.error('Error al insertar caso:', error);
        
        if (error.status === 400) {
          this.errorMessage = 'Datos inválidos. Verifique la información ingresada.';
        } else if (error.status === 500) {
          this.errorMessage = 'Error interno del servidor. Contacte al administrador.';
        }
      }
    });
  }

  // Manejo del modal
  closeModal(): void {
    this.showModal = false;
  }

  nuevoRegistro(): void {
    this.closeModal();
    this.resetFormulario();
    this.cargarDatosIniciales();
  }

  irAInicio(): void {
    this.closeModal();
    this.router.navigate(['/']);
  }

  resetFormulario(): void {
    this.currentStep = 1;
    this.selectedDistrito = null;
    this.selectedDelitos = [];
    this.personas = [];
    this.resetNuevaPersona();
    this.clearMessages();
    
    // Reset filters
    this.filtroDistrito = '';
    this.filtroDelito = '';
    this.filtroRol = '';
    this.filtrarDistritos();
    this.filtrarDelitos();
    this.filtrarRoles();
  }

  // Método para limpiar mensajes
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Métodos auxiliares para las plantillas
  getStepTitle(): string {
    switch (this.currentStep) {
      case 1: return 'Seleccionar Distrito';
      case 2: return 'Seleccionar Delitos';
      case 3: return 'Agregar Personas';
      case 4: return 'Confirmar Registro';
      default: return 'Registro de Caso';
    }
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  // Métodos adicionales necesarios para el HTML
  registrarCaso(): void {
    this.insertarCaso();
  }

  // Propiedades calculadas para el modal
  get casoRegistradoForModal() {
    if (!this.casoRegistrado) return null;
    
    return {
      id: this.casoRegistrado.id,
      codigo: this.casoRegistrado.codigo_caso,
      estado: this.casoRegistrado.estado_caso,
      fecha_registro: this.casoRegistrado.fecha_caso
    };
  }

  // Métodos para el modal
  registrarOtroCaso(): void {
    this.showModal = false;
    this.resetForm();
  }

  volverInicio(): void {
    this.showModal = false;
    // Aquí podrías navegar a otra ruta si es necesario
    // this.router.navigate(['/home']);
  }

  // Método para resetear el formulario
  private resetForm(): void {
    this.currentStep = 1;
    this.selectedDistrito = null;
    this.selectedDelitos = [];
    this.personas = [this.createNewPersona(), this.createNewPersona()];
    this.searchDistrito = '';
    this.searchDelito = '';
    this.isLoading = false;
    this.casoRegistrado = null;
  }

  // Método para crear nueva persona
  createNewPersona(): PersonaConRolRequest {
    return {
      nombres: '',
      apellidos: '',
      tipo_documento: 'DNI',
      numero_documento: '',
      fecha_nacimiento: '',
      sexo: 'M',
      roles: []
    };
  }

  // Métodos para manejo de personas
  addPersona(): void {
    this.personas.push(this.createNewPersona());
  }

  removePersona(index: number): void {
    if (this.personas.length > 2) {
      this.personas.splice(index, 1);
    }
  }

  // Métodos de selección para distritos
  selectDistrito(distrito: any): void {
    this.selectedDistrito = distrito;
  }

}