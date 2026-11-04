# Mesa de ayuda de TI · Taller 06

Aplicación Angular de una sola pantalla para el registro y seguimiento de tickets de soporte.
Corresponde al escenario **E1 - Mesa de ayuda de TI** del Taller 06.

## Requisitos del taller cubiertos

| Requisito | Dónde se implementa |
| --- | --- |
| Sin `NgModule` (solo standalone) | `src/main.ts`, `src/app/app.config.ts` y componentes con `imports` |
| Control flow nuevo (`@if`, `@for`, `@empty`, `@defer`) | `app.html`, `registro-form.html`, `registro-lista.html` |
| Estado con Signals e inmutabilidad (`update()`) | `src/app/services/registro.service.ts` |
| Formularios reactivos sin `ngModel` | `src/app/components/registro-form/registro-form.ts` |
| Modelo tipado `Registro` + `Item` | `src/app/models/registro.model.ts` |
| Validador propio de control | `sinSoloEspacios` en `src/app/validators/registro.validators.ts` |
| Validador de grupo (prioridad «Crítica» ⇒ impacto obligatorio) | `impactoObligatorioSiCritica` en `src/app/validators/registro.validators.ts` |
| `FormArray` de equipos con validador de mínimo 1 fila | `alMenosUnEquipo` en `src/app/validators/registro.validators.ts` |
| Resumen con `computed` dentro de `@defer (on interaction)` | `registro-lista.html` |

## Estructura

```
src/app/
├── models/registro.model.ts            # Interfaces y tipos del dominio
├── services/registro.service.ts        # Signal privada, asReadonly(), computed y CRUD
├── validators/registro.validators.ts   # Validadores de control, grupo y FormArray
├── components/
│   ├── registro-form/                  # Formulario reactivo + FormArray de equipos
│   └── registro-lista/                 # Listado, cambio de estado y resumen diferido
├── app.ts                              # Componente raíz (standalone)
└── app.html                            # Layout de la pantalla
```

## Reglas de negocio

- **Prioridad «Crítica»**: el campo `impacto` pasa a ser obligatorio (validación cruzada de grupo).
- **Equipos afectados**: el `FormArray` exige al menos una fila; cada fila requiere `codigo` y `ubicacion`.
- **Solicitante**: no se aceptan cadenas vacías ni formadas solo por espacios.
- **Estados**: todo ticket nuevo inicia en `Pendiente` y puede pasar a `En proceso` o `Resuelto`.

## Desarrollo

```bash
npm install
npm start          # http://localhost:4200
```

## Build y pruebas

```bash
npm run build
npm test           # Vitest + jsdom
```

> El proyecto usa Angular 22 con componentes standalone, Tailwind CSS 4 y Vitest.
