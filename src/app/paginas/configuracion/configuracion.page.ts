import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonToggle, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ConfiguracionService } from '../../servicios/configuracion.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonToggle, IonButtons, IonBackButton]
})
export class ConfiguracionPage implements OnInit {
  permitirEliminar!: boolean;

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit() {
    this.permitirEliminar = this.configuracionService.obtenerConfiguracion().permitirBorrar;
  }

  onToggleChange() {
    this.configuracionService.guardarConfiguracion({ permitirBorrar: this.permitirEliminar });
  }
}
