export type Categoria = 'Hardware' | 'Software' | 'Red' | 'Accesos' | 'Otro';

export type Prioridad = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export type Impacto = 'Bajo' | 'Medio' | 'Alto';

export type Estado = 'Pendiente' | 'En proceso' | 'Resuelto';

export interface EquipoAfectado {
  codigo: string;
  ubicacion: string;
}

export interface Registro {
  id: string;
  solicitante: string;
  correoInstitucional: string;
  categoria: Categoria;
  prioridad: Prioridad;
  impacto: Impacto | '';
  descripcion: string;
  equipos: EquipoAfectado[];
  estado: Estado;
  fechaCreacion: string;
}

export type NuevoRegistro = Omit<Registro, 'id' | 'estado' | 'fechaCreacion'>;
