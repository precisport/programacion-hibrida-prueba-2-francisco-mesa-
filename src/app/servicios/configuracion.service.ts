import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private readonly CONFIG_KEY = 'app-configuracion';

  private configuracion = {
    permitirBorrar: false // Inicialización por defecto a false
  };

  constructor() {
    this.cargarConfiguracion();
  }

  obtenerConfiguracion() {
    return this.configuracion;
  }

  guardarConfiguracion(config: { permitirBorrar: boolean }) {
    this.configuracion = config;
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.configuracion));
    window.dispatchEvent(new Event('storage')); // Dispara un evento de 'storage' para notificar cambios
  }

  private cargarConfiguracion() {
    const config = localStorage.getItem(this.CONFIG_KEY);
    if (config) {
      this.configuracion = JSON.parse(config);
    }
  }
}

