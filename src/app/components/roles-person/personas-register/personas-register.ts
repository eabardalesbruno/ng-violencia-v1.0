import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonasService } from '../../../shared/services/personas.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PersonaResponse } from '../../../shared/models/response/personas.response';

@Component({
  selector: 'app-personas-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './personas-register.html',
  styleUrls: ['./personas-register.scss'],
  providers: [ToastrService]
})
export class PersonasRegister implements OnInit {

  private readonly personasService = inject(PersonasService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  submitted = false;
  id?: number;

  nombres = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
  ]);
  apellidos = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
  ]);
  tipoDocumento = new FormControl<string>('', [Validators.required]);
  numeroDocumento = new FormControl<string>('', [
    Validators.required,
    Validators.pattern(/^\d{8,12}$/)
  ]);
  fechaNacimiento = new FormControl<string>('', [
    Validators.required,
    Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
  ]);
  sexo = new FormControl<string>('', [Validators.required]);

  registerForm = this.formBuilder.group({
    nombres: this.nombres,
    apellidos: this.apellidos,
    tipoDocumento: this.tipoDocumento,
    numeroDocumento: this.numeroDocumento,
    fechaNacimiento: this.fechaNacimiento,
    sexo: this.sexo
  });

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const idParam = params.get('id');
        if (idParam) {
          this.id = Number(idParam);
          this.getPersona(this.id);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.id) {
      this.update();
    } else {
      this.save();
    }
  }

getPersona(id: number): void {
  this.personasService
    .getPersona(id)
    .subscribe({
      next: (persona: any) => {
        // Transforma a camelCase para el formulario
        const personaCamel = {
          nombres: persona.nombres,
          apellidos: persona.apellidos,
          tipoDocumento: persona.tipo_documento,
          numeroDocumento: persona.numero_documento,
          fechaNacimiento: persona.fecha_nacimiento ? persona.fecha_nacimiento.substring(0, 10) : '',
          sexo: persona.sexo
        };
        this.registerForm.patchValue(personaCamel);
      },
      error: (error: any) => {
        console.error('Error fetching persona:', error);
        this.toastr.error('Error al obtener la persona, por favor consulte al administrador');
      }
    });
}

  save(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    const rawValue = this.registerForm.getRawValue();
    // Transforma a snake_case
    const personaRequest:any = {
      nombres: rawValue.nombres ?? '',
      apellidos: rawValue.apellidos ?? '',
      tipo_documento: rawValue.tipoDocumento ?? '',
      numero_documento: rawValue.numeroDocumento ?? '',
      fecha_nacimiento: rawValue.fechaNacimiento ?? '',
      sexo: rawValue.sexo ?? ''
    };
    this.personasService
      .create(personaRequest)
      .subscribe({
        next: () => {
          this.router.navigate(['/personas']);
          this.toastr.success('Persona creada exitosamente');
        },
        error: (error: any) => {
          console.error('Error creating persona:', error);
          this.toastr.error('Error al crear la persona, por favor consulte al administrador');
        }
      });
  }

  update(): void {
    this.submitted = true;
    if (this.registerForm.invalid || !this.id) {
      return;
    }
    const rawValue = this.registerForm.getRawValue();
    // Transforma a snake_case
    const personaRequest : any = {
      nombres: rawValue.nombres ?? '',
      apellidos: rawValue.apellidos ?? '',
      tipo_documento: rawValue.tipoDocumento ?? '',
      numero_documento: rawValue.numeroDocumento ?? '',
      fecha_nacimiento: rawValue.fechaNacimiento ?? '',
      sexo: rawValue.sexo ?? ''
    };
    this.personasService
      .update(this.id, personaRequest)
      .subscribe({
        next: () => {
          this.router.navigate(['/personas']);
          this.toastr.success('Persona actualizada exitosamente');
        },
        error: (error: any) => {
          console.error('Error updating persona:', error);
          this.toastr.error('Error al actualizar la persona, por favor consulte al administrador');
        }
      });
  }
}