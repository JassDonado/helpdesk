import { Component, DestroyRef, inject, signal } from '@angular/core';
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
  private readonly destroyRef = inject(DestroyRef);

  private mensajeTimer?: ReturnType<typeof setTimeout>;

  protected readonly categorias: Categoria[] = ['Hardware', 'Software', 'Red', 'Accesos', 'Otro'];
  protected readonly prioridades: Prioridad[] = ['Baja', 'Media', 'Alta', 'Crítica'];
  protected readonly impactos: Impacto[] = ['Bajo', 'Medio', 'Alto'];

  protected readonly mensaje = signal<string | null>(null);

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

  protected readonly inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100';

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.mensajeTimer) {
        clearTimeout(this.mensajeTimer);
      }
    });
  }

  protected get equipos() {
    return this.form.controls.equipos;
  }

  protected invalido(control: { invalid: boolean; touched: boolean; dirty: boolean } | null): boolean {
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  protected get errorImpactoCritico(): boolean {
    const impacto = this.form.controls.impacto;
    return (
      this.form.hasError('impactoRequerido') && (impacto.touched || impacto.dirty || this.form.dirty)
    );
  }

  protected agregarEquipo(): void {
    this.equipos.insert(this.equipos.length, this.crearEquipo());
  }

  protected quitarEquipo(index: number): void {
    this.equipos.removeAt(index);
    this.equipos.markAsDirty();
    this.equipos.markAsTouched();
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
    this.mostrarMensaje('Ticket registrado correctamente.');
  }

  private mostrarMensaje(texto: string): void {
    if (this.mensajeTimer) {
      clearTimeout(this.mensajeTimer);
    }

    this.mensaje.set(texto);
    this.mensajeTimer = setTimeout(() => this.mensaje.set(null), 4000);
  }

  private crearEquipo() {
    return this.fb.nonNullable.group({
      codigo: ['', [Validators.required, sinSoloEspacios]],
      ubicacion: ['', [Validators.required]],
    });
  }
}
