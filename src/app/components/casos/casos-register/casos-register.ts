import { Component, inject, OnInit } from '@angular/core';
import { CasoService } from '../../../shared/services/caso.service';
import { CasoCompletoRequest, PersonaConRolRequest } from '../../../shared/models/request/insertarcaso.request';
import { CasoCompletoResponse } from '../../../shared/models/response/insertarcaso.response';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-casos-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
    
    // Usar datos hardcodeados para asegurar que siempre se muestren
    const datosDistritos = [
      { "id": 22, "nombre": "Ministerio de la Mujer y Equidad de Género - Junín", "estado": true },
      { "id": 26, "nombre": "Policía Nacional de Colombia - Junín", "estado": true },
      { "id": 31, "nombre": "Policía Nacional de Colombia - Ancash", "estado": true },
      { "id": 32, "nombre": "Policía Nacional de Colombia - Ayacucho", "estado": true },
      { "id": 33, "nombre": "Policía Nacional de Colombia - Cuzco", "estado": true },
      { "id": 34, "nombre": "Policía Nacional de Colombia - Junín", "estado": true },
      { "id": 35, "nombre": "Policía Nacional de Colombia - La Libertad", "estado": true },
      { "id": 36, "nombre": "Policía Nacional de Colombia - Lima", "estado": true },
      { "id": 37, "nombre": "Policía Nacional de Colombia - Loreto", "estado": true },
      { "id": 38, "nombre": "Policía Nacional de Colombia - Tacna", "estado": true },
      { "id": 39, "nombre": "Rama Judicial - Ancash", "estado": true },
      { "id": 40, "nombre": "Rama Judicial - Ayacucho", "estado": true },
      { "id": 41, "nombre": "Rama Judicial - Cuzco", "estado": true },
      { "id": 42, "nombre": "Rama Judicial - Junín", "estado": true },
      { "id": 43, "nombre": "Rama Judicial - Tacna", "estado": true },
      { "id": 44, "nombre": "Rama Judicial - Lima", "estado": true },
      { "id": 45, "nombre": "Rama Judicial - Loreto", "estado": true },
      { "id": 46, "nombre": "Rama Judicial - Tacna", "estado": true },
      { "id": 47, "nombre": "Ministerio de la Mujer y Equidad de Género - Ancash", "estado": true },
      { "id": 48, "nombre": "Ministerio de la Mujer y Equidad de Género - Ayacucho", "estado": true },
      { "id": 49, "nombre": "Ministerio de la Mujer y Equidad de Género - Cuzco", "estado": true },
      { "id": 50, "nombre": "Ministerio de la Mujer y Equidad de Género - Junín", "estado": true },
      { "id": 51, "nombre": "Ministerio de la Mujer y Equidad de Género - La Libertad", "estado": true },
      { "id": 52, "nombre": "Ministerio de la Mujer y Equidad de Género - Lima", "estado": true },
      { "id": 53, "nombre": "Ministerio de la Mujer y Equidad de Género - Loreto", "estado": true },
      { "id": 54, "nombre": "Ministerio de la Mujer y Equidad de Género - Tacna", "estado": true },
      { "id": 55, "nombre": "Ministerio de la Mujer y Equidad de Género - Tacna", "estado": true },
      { "id": 56, "nombre": "Policía Nacional de Colombia - Cuzco", "estado": true },
      { "id": 57, "nombre": "Rama Judicial - La Libertad", "estado": true }
    ];
    
    // Cargar distritos - usar datos hardcodeados directamente
    this.distritos = datosDistritos;
    this.distritosFiltrados = [...datosDistritos];
    console.log('Distritos cargados (hardcoded):', this.distritos);
    console.log('Distritos filtrados:', this.distritosFiltrados);
    console.log('Primer distrito de ejemplo:', this.distritos[0]);
    
    // Opcionalmente intentar cargar desde el servicio para comparar
    this.casoService.getEntidadesDistrito().subscribe({
      next: (data) => {
        console.log('Datos del servicio (para comparación):', data);
        // Si el servicio devuelve datos válidos, podrías usarlos en lugar de los hardcodeados
        // this.distritos = data;
        // this.distritosFiltrados = [...data];
      },
      error: (error) => {
        console.error('Error cargando distritos del servicio:', error);
      }
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
        this.rolesList = [...data]; 
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
    this.selectedDistrito = distrito; // Guardar el objeto completo, no solo el ID
    console.log('Distrito seleccionado:', distrito);
    console.log('selectedDistrito asignado:', this.selectedDistrito);
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
    if (!this.selectedDistrito) return 'N/A';
    return `ID: ${this.selectedDistrito.id}` || 'N/A';
  }

  // Método para obtener solo el ID del distrito
  getDistritoId(): number | null {
    return this.selectedDistrito ? this.selectedDistrito.id : null;
  }

  // Método para obtener información completa del distrito
  getDistritoFullInfo(): string {
    if (!this.selectedDistrito) return 'Ningún distrito seleccionado';
    return `${this.selectedDistrito.nombre} (ID: ${this.selectedDistrito.id})`;
  }

  canProceedToNextStep(): boolean {
    return this.validateCurrentStep();
  }

  // Método para validar si una persona tiene toda la información completa
  isPersonaValid(persona: PersonaConRolRequest): boolean {
    return !!(
      persona.nombres.trim() &&
      persona.apellidos.trim() &&
      persona.numero_documento.trim() &&
      persona.fecha_nacimiento &&
      persona.roles.length > 0
    );
  }

  // Método para contar personas válidas
  getValidPersonasCount(): number {
    return this.personas.filter(persona => this.isPersonaValid(persona)).length;
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

    // Logs para diagnosticar el problema
    console.log('=== DATOS PARA ENVIAR AL BACKEND ===');
    console.log('selectedDistrito completo:', this.selectedDistrito);
    console.log('ID del distrito a enviar:', this.selectedDistrito?.id);
    console.log('selectedDelitos completos:', this.selectedDelitos);
    console.log('IDs de delitos a enviar:', this.selectedDelitos.map(d => d.id));
    console.log('personas completas:', this.personas);

    const caso: CasoCompletoRequest = {
      id_entidad_distrito: this.selectedDistrito?.id || this.selectedDistrito,
      delitos: this.selectedDelitos.map(d => d.id),
      personas: this.personas
    };

    console.log('JSON que se enviará al backend:', JSON.stringify(caso, null, 2));

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
    console.log('selectDistrito llamado con:', distrito);
  }

  // Método para validar si se puede registrar el caso
  canRegisterCase(): boolean {
    const distritoValido = this.selectedDistrito !== null && 
                          (this.selectedDistrito.id || typeof this.selectedDistrito === 'number');
    
    const delitosValidos = this.selectedDelitos.length > 0;
    
    const personasValidas = this.personas.length >= 2 &&
                           this.personas.every(persona => this.isPersonaValid(persona));
    
    console.log('Validación de registro:', {
      distritoValido,
      selectedDistrito: this.selectedDistrito,
      delitosValidos,
      selectedDelitos: this.selectedDelitos.length,
      personasValidas,
      personasCount: this.personas.length
    });
    
    return distritoValido && delitosValidos && personasValidas;
  }

  // Método para verificar si un delito está seleccionado
  isDelitoSelected(delito: any): boolean {
    return this.selectedDelitos.some(selected => selected.id === delito.id);
  }

  // Método para obtener los IDs de delitos seleccionados
  getSelectedDelitosIds(): string {
    return this.selectedDelitos.map(d => d.id).join(', ');
  }

  // Método para obtener información detallada del distrito
  getDistritoInfo(): string {
    if (!this.selectedDistrito) return 'Ningún distrito seleccionado';
    return `${this.selectedDistrito.nombre} (ID: ${this.selectedDistrito.id})`;
  }

  // Método para validar que el distrito tiene un ID válido
  isDistritoValid(): boolean {
    return this.selectedDistrito && 
           this.selectedDistrito.id && 
           typeof this.selectedDistrito.id === 'number';
  }

  // Método de prueba para seleccionar el primer distrito automáticamente (para debugging)
  seleccionarPrimerDistrito(): void {
    if (this.distritos.length > 0) {
      this.seleccionarDistrito(this.distritos[0]);
      console.log('Distrito seleccionado automáticamente:', this.selectedDistrito);
    }
  }

  imprimirConstanciaCaso() {
    if (!this.casoRegistrado) {
      console.error('No hay datos del caso registrado para imprimir.');
      return;
    }

    const formattedDate = new Date(this.casoRegistrado.fecha_caso).toLocaleDateString('es-ES');
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color:rgb(66, 163, 193);">Constancia de Caso Registrado</h1>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <th style="background-color:rgb(66, 193, 134); color: #fff; padding: 10px; text-align: left;">Código</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${this.casoRegistrado.codigo_caso}</td>
          </tr>
          <tr>
            <th style="background-color: #6f42c1; color: #fff; padding: 10px; text-align: left;">ID</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${this.casoRegistrado.id}</td>
          </tr>
          <tr>
            <th style="background-color: #6f42c1; color: #fff; padding: 10px; text-align: left;">Estado</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${this.casoRegistrado.estado_caso}</td>
          </tr>
          <tr>
            <th style="background-color: #6f42c1; color: #fff; padding: 10px; text-align: left;">Fecha</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${formattedDate}</td>
          </tr>
        </table>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('No se pudo abrir la ventana de impresión.');
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }
}