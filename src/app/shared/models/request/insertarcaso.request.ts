export type PersonaConRolRequest = {
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string;
  sexo: string;
  roles: number[]; 
};

export type CasoCompletoRequest = {
  id_entidad_distrito: number;
  delitos: number[];
  personas: PersonaConRolRequest[];
};