import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-formulario-cita',
  templateUrl: './formulario-cita.component.html',
  styleUrls: ['./formulario-cita.component.scss']
})
export class FormularioCitaComponent {
  formularioCita: FormGroup;
  @Output() citaAgregada = new EventEmitter<{ frase: string, autor: string }>();

  constructor(private fb: FormBuilder) {
    this.formularioCita = this.fb.group({
      frase: ['', [Validators.required, Validators.minLength(5)]],
      autor: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  onSubmit() {
    if (this.formularioCita.valid) {
      this.citaAgregada.emit(this.formularioCita.value);
      this.formularioCita.reset();
    }
  }
}
