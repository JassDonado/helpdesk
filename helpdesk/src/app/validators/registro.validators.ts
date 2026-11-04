import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export function sinSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;

  if (typeof valor === 'string' && valor.trim().length === 0) {
    return { soloEspacios: true };
  }

  return null;
}

export const alMenosUnEquipo: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const equipos = control as FormArray;

  return equipos.length > 0 ? null : { sinEquipos: true };
};

export function impactoObligatorioSiCritica(group: AbstractControl): ValidationErrors | null {
  const prioridad = group.get('prioridad')?.value;
  const impacto = group.get('impacto')?.value;

  const impactoVacio = impacto === null || impacto === undefined || String(impacto).trim() === '';

  if (prioridad === 'Crítica' && impactoVacio) {
    return { impactoRequerido: true };
  }

  return null;
}
