import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador propio de control: rechaza cadenas vacías o formadas solo por espacios.
 * Se usa en "solicitante" y en el "codigo" de cada equipo afectado.
 */
export function sinSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;

  if (typeof valor === 'string' && valor.trim().length === 0) {
    return { soloEspacios: true };
  }

  return null;
}

/**
 * Validador propio a nivel de FormArray: exige al menos un ítem (equipo afectado).
 */
export const alMenosUnEquipo: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const equipos = control as FormArray;

  return equipos.length > 0 ? null : { sinEquipos: true };
};

/**
 * Validador de grupo (validación cruzada):
 * si la prioridad es "Crítica", el impacto pasa a ser estrictamente obligatorio.
 */
export function impactoObligatorioSiCritica(group: AbstractControl): ValidationErrors | null {
  const prioridad = group.get('prioridad')?.value;
  const impacto = group.get('impacto')?.value;

  const impactovacio = impacto === null || impacto === undefined || String(impacto).trim() === '';

  if (prioridad === 'Crítica' && impactovacio) {
    return { impactoRequerido: true };
  }

  return null;
}
