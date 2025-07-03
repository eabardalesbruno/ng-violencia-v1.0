export interface EntidadDistritoResponse {
  id: number;
  entidad_id: number;
  distrito_id: number;
}

// Interfaz para Entidad
export interface Entidad {
  id: number;
  nombre: string;
}

// Respuesta paginada de tu API
export interface EntidadDistritoPaginatedResponse {
  content: EntidadDistritoResponse[];
  pageable: {
    page_number: number;
    page_size: number;
    sort: any;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  total_elements: number;
  total_pages: number;
  size: number;
  number: number;
  sort: any;
  first: boolean;
  number_of_elements: number;
  empty: boolean;
}

// Versión mapeada para usar en tu componente con nombres legibles
export interface EntidadDistritoMapped {
  id: number;
  entidad_id: number;
  distrito_id: number;
  entidadNombre: string;
  distritoNombre: string;
}
