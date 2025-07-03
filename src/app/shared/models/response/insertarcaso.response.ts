export type CasoCompletoResponse = {
  id: number;
  codigo_caso: string;
  estado_caso: string;
  fecha_caso: string; 
  delitos?: number[] | null;
  roles_persona_caso?: string[] | null;
};