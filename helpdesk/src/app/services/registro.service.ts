import { computed, Injectable, signal } from '@angular/core';
import { Estado, NuevoRegistro, Registro } from '../models/registro.model';

@Injectable({ providedIn: 'root' })
export class RegistroService {
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

  readonly registros = this._registros.asReadonly();

  readonly total = computed(() => this._registros().length);

  readonly pendientes = computed(
    () => this._registros().filter((registro) => registro.estado === 'Pendiente').length,
  );

  readonly enProceso = computed(
    () => this._registros().filter((registro) => registro.estado === 'En proceso').length,
  );

  readonly resueltos = computed(
    () => this._registros().filter((registro) => registro.estado === 'Resuelto').length,
  );

  agregar(datos: NuevoRegistro): void {
    const nuevo: Registro = {
      ...datos,
      id: this.generarId(),
      estado: 'Pendiente',
      fechaCreacion: new Date().toISOString(),
    };

    this._registros.update((registros) => [...registros, nuevo]);
  }

  cambiarEstado(id: string, nuevoEstado: Estado): void {
    this._registros.update((registros) =>
      registros.map((registro) =>
        registro.id === id ? { ...registro, estado: nuevoEstado } : registro,
      ),
    );
  }

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
