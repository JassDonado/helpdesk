import { computed, Injectable, signal } from '@angular/core';
import { Estado, NuevoRegistro, Registro } from '../models/registro.model';

/**
 * Servicio en memoria de la mesa de ayuda.
 * No usa HttpClient ni rutas: el estado vive en una signal privada.
 */
@Injectable({ providedIn: 'root' })
export class RegistroService {
  /** Signal privada: única fuente de verdad de los tickets. */
  private readonly _registros = signal<Registro[]>([
    {
      id: 'demo-1',
      solicitante: 'Laura Gómez',
      correoInstitucional: 'laura.gomez@institucion.edu.co',
      categoria: 'Red',
      prioridad: 'Alta',
      impacto: 'Medio',
      descripcion: 'El equipo de la sala de sistemas no tiene conexión a la red desde esta mañana.',
      equipos: [{ codigo: 'PC-1042', ubicacion: 'Bloque B - Sala 204' }],
      estado: 'Pendiente',
      fechaCreacion: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      solicitante: 'Carlos Pérez',
      correoInstitucional: 'carlos.perez@institucion.edu.co',
      categoria: 'Accesos',
      prioridad: 'Media',
      impacto: 'Bajo',
      descripcion: 'Solicita restablecimiento de contraseña del correo institucional.',
      equipos: [{ codigo: 'LAP-0087', ubicacion: 'Oficina de registro' }],
      estado: 'En proceso',
      fechaCreacion: new Date().toISOString(),
    },
  ]);

  /** Signal pública de solo lectura que consumen los componentes. */
  readonly registros = this._registros.asReadonly();

  /** Computed: cantidad total de registros. */
  readonly total = computed(() => this._registros().length);

  /** Computed: registros con estado "Pendiente". */
  readonly pendientes = computed(
    () => this._registros().filter((registro) => registro.estado === 'Pendiente').length,
  );

  /** Computed extra para el panel de resumen. */
  readonly enProceso = computed(
    () => this._registros().filter((registro) => registro.estado === 'En proceso').length,
  );

  /** Computed extra para el panel de resumen. */
  readonly resueltos = computed(
    () => this._registros().filter((registro) => registro.estado === 'Resuelto').length,
  );

  /**
   * Agrega un ticket generando un arreglo NUEVO (inmutabilidad con update()).
   */
  agregar(datos: NuevoRegistro): void {
    const nuevo: Registro = {
      ...datos,
      id: this.generarId(),
      estado: 'Pendiente',
      fechaCreacion: new Date().toISOString(),
    };

    this._registros.update((registros) => [...registros, nuevo]);
  }

  /**
   * Cambia el estado de un ticket sin mutar el arreglo original.
   */
  cambiarEstado(id: string, nuevoEstado: Estado): void {
    this._registros.update((registros) =>
      registros.map((registro) =>
        registro.id === id ? { ...registro, estado: nuevoEstado } : registro,
      ),
    );
  }

  /**
   * Elimina un ticket devolviendo un arreglo nuevo (sin .splice()).
   */
  eliminar(id: string): void {
    this._registros.update((registros) => registros.filter((registro) => registro.id !== id));
  }

  private generarId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    return `ticket-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
