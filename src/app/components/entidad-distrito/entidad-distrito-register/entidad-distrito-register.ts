import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // ← Agregar RouterLink aquí
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EntidadDistritoService } from '../../../shared/services/entidad-distrito.service';

@Component({
  selector: 'app-entidad-distrito-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // ← Agregar RouterLink aquí
  templateUrl: './entidad-distrito-register.html',
  styleUrls: ['./entidad-distrito-register.scss'],
  providers: [ToastrService]
})
export class EntidadDistritoRegister implements OnInit {
  
  entidadDistritoForm: FormGroup;
  isEditMode = false;
  entidadDistritoId?: number;
  entidades: any[] = [];
  distritos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private entidadDistritoService: EntidadDistritoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.entidadDistritoForm = this.fb.group({
      entidad_id: ['', [Validators.required]], // Cambia a entidad_id
      distrito_id: ['', [Validators.required]]  // Cambia a distrito_id
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.entidadDistritoId = +id;
        // Cargar datos para editar
        this.entidadDistritoService.getEntidadDistrito(this.entidadDistritoId).subscribe((data: any) => {
          this.entidadDistritoForm.patchValue({
            entidad_id: data.entidad_id,
            distrito_id: data.distrito_id
          });
        });
      } else {
        this.isEditMode = false;
        this.entidadDistritoForm.reset();
      }
    });
    this.loadCatalogos(); // Carga los catálogos al iniciar
  }

  loadCatalogos(): void {
    // Cargar entidades desde el servicio real
    this.entidadDistritoService.getEntidades().subscribe({
      next: (entidades: any[]) => {
        this.entidades = entidades;
      },
      error: (error: any) => {
        console.error('Error loading entidades:', error);
      }
    });

    // Cargar distritos fiscales desde el servicio real
    // Cambia el nombre del método si es necesario (usa el que esté en tu servicio)
    this.entidadDistritoService.getDistritos().subscribe({
      next: (distritos: any[]) => {
        this.distritos = distritos;
      },
      error: (error: any) => {
        console.error('Error loading distritos:', error);
      }
    });
  }

  loadEntidadDistrito(id: number): void {
    this.entidadDistritoService.getEntidadDistrito(id).subscribe({
      next: (entidadDistrito: any) => {
        this.entidadDistritoForm.patchValue({
          entidad_id: entidadDistrito.entidad_id,
          distrito_id: entidadDistrito.distrito_id
        });
      },
      error: (error: any) => {
        console.error('Error loading entidad-distrito:', error);
        this.toastr.error('Error al cargar la entidad-distrito');
      }
    });
  }

  save(): void {
    if (this.entidadDistritoForm.invalid) return;
    const formValue = this.entidadDistritoForm.value;
    // Forzar el tipo a any para enviar el body con las claves correctas
    this.entidadDistritoService.create({
      entidadId: formValue.entidad_id,
      distritoId: formValue.distrito_id
    } as any).subscribe({
      next: () => {
        this.toastr.success('Entidad-Distrito registrada correctamente');
        this.router.navigate(['/entidaddistrito']);
      },
      error: (error: any) => {
        this.toastr.error('Error al registrar la Entidad-Distrito');
        console.error(error);
      }
    });
  }

  update(): void {
    if (this.entidadDistritoForm.invalid || !this.entidadDistritoId) return;
    const formValue = this.entidadDistritoForm.value;
    // Forzar el tipo a any para enviar el body con las claves correctas
    this.entidadDistritoService.update(this.entidadDistritoId, {
      entidadId: formValue.entidad_id,
      distritoId: formValue.distrito_id
    } as any).subscribe({
      next: () => {
        this.toastr.success('Entidad-Distrito actualizada correctamente');
        this.router.navigate(['/entidaddistrito']);
      },
      error: (error: any) => {
        this.toastr.error('Error al actualizar la Entidad-Distrito');
        console.error(error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/entidaddistrito']);
  }

  // Getters para fácil acceso a los controles del formulario
  get entidadId() { return this.entidadDistritoForm.get('entidad_id'); }
  get distritoId() { return this.entidadDistritoForm.get('distrito_id'); }
}