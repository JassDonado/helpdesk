import { Component } from '@angular/core';
import { RegistroForm } from './components/registro-form/registro-form';
import { RegistroLista } from './components/registro-lista/registro-lista';

@Component({
  selector: 'app-root',
  imports: [RegistroForm, RegistroLista],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
