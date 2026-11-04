import { Component, inject } from '@angular/core';
import { Estado, Registro } from '../../models/registro.model';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-registro-lista',
  templateUrl: './registro-lista.html',
})
export class RegistroLista {
  private readonly registroService = inject(RegistroService);

  /** Signal pública expuesta por el servicio. */
  protected readonly registros = this.registroService.registros;

  /** Computed del servicio usados en el panel de resumen. */
  protected readonly total = this.registroService.total;
  protected readonly pendientes = this.registroService.pendientes;
  protected readonly enProceso = this.registroService.enProceso;
  protected readonly resueltos = this.registroService.resueltos;

  protected readonly estados: Estado[] = ['Pendiente', 'En proceso', 'Resuelto'];

  /** Cambia el estado del ticket a partir del select de cada tarjeta. */
  protected cambiarEstado(id: string, evento: Event): void {
    const nuevoEstado = (evento.target as HTMLSelectElement).value as Estado;
    this.registroService.cambiarEstado(id, nuevoEstado);
  }

  /** Elimina un ticket de la mesa de ayuda. */
  protected eliminar(id: string): void {
    this.registroService.eliminar(id);
  }

  /** Clases del badge según la prioridad del ticket. */
  protected clasesPrioridad(prioridad: Registro['prioridad']): string {
    switch (prioridad) {
      case 'Crítica':
        return 'bg-red-100 text-red-700 ring-red-200';
      case 'Alta':
        return 'bg-orange-100 text-orange-700 ring-orange-200';
      case 'Media':
        return 'bg-amber-100 text-amber-700 ring-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
    }
  }
}
