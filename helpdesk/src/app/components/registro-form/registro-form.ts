import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria, Impacto, NuevoRegistro, Prioridad } from '../../models/registro.model';
import { RegistroService } from '../../services/registro.service';
import {
  alMenosUnEquipo,
  impactoObligatorioSiCritica,
  sinSoloEspacios,
} from '../../validators/registro.validators';

@Component({
  selector: 'app-registro-form',
  imports: [ReactiveFormsModule],
  templateUrl: './registro-form.html',
})
export class RegistroForm {
  private readonly fb = inject(FormBuilder);
  private readonly registroService = inject(RegistroService);

  /** Catálogos para los selects del formulario. */
  protected readonly categorias: Categoria[] = ['Hardware', 'Software', 'Red', 'Accesos', 'Otro'];
  protected readonly prioridades: Prioridad[] = ['Baja', 'Media', 'Alta', 'Crítica'];
  protected readonly impactos: Impacto[] = ['Bajo', 'Medio', 'Alto'];

  /** Mensaje de éxito tras guardar un ticket. */
  protected readonly mensaje = signal<string | null>(null);

  /**
   * Formulario reactivo con FormBuilder + nonNullable.
   * Incluye validadores integrados, uno propio de control, uno de grupo
   * y un FormArray "equipos" con su propio validador.
   */
  protected readonly form = this.fb.nonNullable.group(
    {
      solicitante: ['', [Validators.required, Validators.minLength(3), sinSoloEspacios]],
      correoInstitucional: ['', [Validators.required, Validators.email]],
      categoria: ['', [Validators.required]],
      prioridad: ['', [Validators.required]],
      impacto: [''],
      descripcion: ['', [Validators.required, Validators.minLength(15)]],
      equipos: this.fb.nonNullable.array([this.crearEquipo()], [alMenosUnEquipo]),
    },
    { validators: [impactoObligatorioSiCritica] },
  );

  /** Acceso corto al FormArray desde la plantilla. */
  protected get equipos() {
    return this.form.controls.equipos;
  }

  /** Clases base compartidas por todos los inputs. */
  protected readonly inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100';

  /**
   * Los errores solo se muestran si el control es inválido Y (touched o dirty).
   */
  protected invalido(control: { invalid: boolean; touched: boolean; dirty: boolean } | null): boolean {
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /** Indica si la regla de grupo "impacto obligatorio si prioridad crítica" debe mostrarse. */
  protected get errorImpactoCritico(): boolean {
    const impacto = this.form.controls.impacto;
    return (
      this.form.hasError('impactoRequerido') && (impacto.touched || impacto.dirty || this.form.dirty)
    );
  }

  /** Agrega una fila al FormArray de equipos afectados. */
  protected agregarEquipo(): void {
    this.equipos.insert(this.equipos.length, this.crearEquipo());
  }

  /** Quita una fila del FormArray de equipos afectados. */
  protected quitarEquipo(index: number): void {
    this.equipos.removeAt(index);
    // removeAt no marca el arreglo como dirty/touched; lo forzamos para que
    // el mensaje del validador "al menos un equipo" sea visible de inmediato.
    this.equipos.markAsDirty();
    this.equipos.markAsTouched();
  }

  /** Envía el formulario, delega en el servicio y limpia el formulario. */
  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // getRawValue() incluye los valores aunque algún control estuviera deshabilitado.
    const raw = this.form.getRawValue();

    const datos: NuevoRegistro = {
      solicitante: raw.solicitante.trim(),
      correoInstitucional: raw.correoInstitucional.trim(),
      categoria: raw.categoria as Categoria,
      prioridad: raw.prioridad as Prioridad,
      impacto: raw.impacto as Impacto | '',
      descripcion: raw.descripcion.trim(),
      equipos: raw.equipos.map((equipo) => ({
        codigo: equipo.codigo.trim(),
        ubicacion: equipo.ubicacion.trim(),
      })),
    };

    this.registroService.agregar(datos);

    this.form.reset();
    this.equipos.clear();
    this.equipos.insert(0, this.crearEquipo());
    this.mensaje.set('Ticket registrado correctamente en la mesa de ayuda.');
  }

  /** Crea un grupo tipado para cada equipo afectado (fila del FormArray). */
  private crearEquipo() {
    return this.fb.nonNullable.group({
      codigo: ['', [Validators.required, sinSoloEspacios]],
      ubicacion: ['', [Validators.required]],
    });
  }
}
