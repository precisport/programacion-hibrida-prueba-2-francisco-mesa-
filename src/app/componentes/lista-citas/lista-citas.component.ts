import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-lista-citas',
  templateUrl: './lista-citas.component.html',
  styleUrls: ['./lista-citas.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ListaCitasComponent {
  @Input() citas: { frase: string, autor: string }[] = [];
  @Output() borrarCita = new EventEmitter<number>();

  eliminarCita(index: number) {
    this.borrarCita.emit(index);
  }
}
