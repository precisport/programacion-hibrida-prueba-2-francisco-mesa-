import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CitaService } from '../servicios/cita.service';
import { ConfiguracionService } from '../servicios/configuracion.service';
import { add, settingsOutline, trashBinOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Citas } from '../modelo/citas';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class HomePage implements OnInit, OnDestroy {
  citasAleatorias: Citas[] = [];
  citaAleatoria: Citas | null = null;
  permitirEliminar: boolean = false;

  constructor(private citaService: CitaService, private configuracionService: ConfiguracionService) {
    addIcons({ settingsOutline, add, trashBinOutline });
  }

  async ngOnInit() {
    await this.actualizarCitasAleatorias();
    this.actualizarPermitirEliminar();
    window.addEventListener('storage', this.actualizarCitasAleatorias.bind(this));
    window.addEventListener('storage', this.actualizarPermitirEliminar.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('storage', this.actualizarCitasAleatorias.bind(this));
    window.removeEventListener('storage', this.actualizarPermitirEliminar.bind(this));
  }

  actualizarPermitirEliminar() {
    this.permitirEliminar = this.configuracionService.obtenerConfiguracion().permitirBorrar;
  }

  async actualizarCitasAleatorias() {
    this.citasAleatorias = await this.citaService.obtenerCitas();
    if (this.citasAleatorias.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * this.citasAleatorias.length);
      this.citaAleatoria = this.citasAleatorias[indiceAleatorio];
    } else {
      this.citaAleatoria = null;
    }
  }

  async eliminarCita() {
    if (this.citaAleatoria && this.permitirEliminar) {
      await this.citaService.eliminarCita(this.citaAleatoria.id);
      await this.actualizarCitasAleatorias();
    }
  }
}
