/**
 * Modelo de dominio del taller 06 - Escenario E1: Mesa de ayuda de TI.
 * Todo el tipado vive aquí para que servicio y componentes compartan el contrato.
 */

/** Categorías permitidas para un ticket de soporte. */
export type Categoria = 'Hardware' | 'Software' | 'Red' | 'Accesos' | 'Otro';

/** Niveles de prioridad. "Crítica" activa la regla de validación cruzada sobre "impacto". */
export type Prioridad = 'Baja' | 'Media' | 'Alta' | 'Crítica';

/** Nivel de impacto del incidente en la operación. */
export type Impacto = 'Bajo' | 'Medio' | 'Alto';

/** Estados por los que pasa un ticket dentro de la mesa de ayuda. */
export type Estado = 'Pendiente' | 'En proceso' | 'Resuelto';

/** Ítem dinámico del FormArray "equipos": equipo afectado por el ticket. */
export interface EquipoAfectado {
  codigo: string;
  ubicacion: string;
}

/** Registro completo almacenado en memoria por el servicio. */
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

/**
 * Datos que llegan desde el formulario antes de que el servicio
 * asigne el id, el estado inicial y la fecha de creación.
 */
export type NuevoRegistro = Omit<Registro, 'id' | 'estado' | 'fechaCreacion'>;
