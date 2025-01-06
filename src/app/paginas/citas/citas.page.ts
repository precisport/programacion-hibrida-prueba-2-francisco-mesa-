import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CitaService } from '../../servicios/cita.service';
import { ConfiguracionService } from '../../servicios/configuracion.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { settingsOutline, add, createOutline, trashBinOutline } from 'ionicons/icons';
import { Citas } from '../../modelo/citas';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule]
})
export class CitasPage implements OnInit {
  citas: Citas[] = [];
  permitirBorrar: boolean = false;

  constructor(private citaService: CitaService, private configuracionService: ConfiguracionService) {
    addIcons({ settingsOutline, add, createOutline, trashBinOutline });
  }

  async ngOnInit() {
    await this.citaService.iniciarPlugin();
    this.citas = await this.citaService.obtenerCitas();
    this.permitirBorrar = this.configuracionService.obtenerConfiguracion().permitirBorrar;
  }

  async agregarCita(form: NgForm) {
    if (form.valid) {
      const nuevaCita: Citas = {
        id: Date.now(), // Generar un ID único basado en el tiempo actual
        frase: form.value.frase,
        autor: form.value.autor
      };
      await this.citaService.guardarCita(nuevaCita);
      this.citas = await this.citaService.obtenerCitas();
      form.reset();
    } else {
      form.control.markAllAsTouched();
    }
  }

  async borrarCita(id: number | undefined) {
    if (this.permitirBorrar && id !== undefined) {
      await this.citaService.eliminarCita(id);
      this.citas = await this.citaService.obtenerCitas();
    }
  }
}
