import { Injectable } from '@angular/core';
import { Citas } from '../modelo/citas';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  db!: SQLiteDBConnection;

  plataforma: string = " ";

  DB_NAME: string = "lista_cita";
  DB_ENCRIPTADA: boolean = false;
  DB_MODE: string = "no-encryption";
  DB_VERSION: number = 1;
  DB_READ_ONLY: boolean = false;
  TABLE_NAME: string = "lista_cita";
  COL_CITA: string = "frase";
  COL_AUTOR: string = "autor";
  DB_SQL_TABLAS: string = `
    CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ${this.COL_CITA} TEXT NOT NULL,
      ${this.COL_AUTOR} TEXT NOT NULL
    );
  `;

  constructor() {}

  private async _iniciarPluginWeb(): Promise<void> {
    await customElements.whenDefined('jeep-sqlite');
    const jeepSqliteEl = document.querySelector('jeep-sqlite');
    if (jeepSqliteEl != null) {
      await this.sqlite.initWebStore();
    }
  }

  async iniciarPlugin() {
    this.plataforma = Capacitor.getPlatform();
    if (this.plataforma === 'web') {
      await this._iniciarPluginWeb();
    }
    await this.abrirConexion();
    await this.db.execute(this.DB_SQL_TABLAS);
  }

  async abrirConexion() {
    const ret = await this.sqlite.checkConnectionsConsistency();
    const isConn = (await this.sqlite.isConnection(this.DB_NAME, this.DB_READ_ONLY)).result;
    if (ret.result && isConn) {
      this.db = await this.sqlite.retrieveConnection(this.DB_NAME, this.DB_READ_ONLY);
    } else {
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        this.DB_ENCRIPTADA,
        this.DB_MODE,
        this.DB_VERSION,
        this.DB_READ_ONLY
      );
    }
    await this.db.open();
  }

  async obtenerCitas(): Promise<Citas[]> {
    if (!this.db) {
      await this.abrirConexion(); // Asegúrate de que la conexión esté abierta antes de realizar la consulta
    }
    const sql = `SELECT * FROM ${this.TABLE_NAME}`;
    const resultado = await this.db.query(sql);
    return resultado?.values ?? [];
  }

  async guardarCita(cita: Citas) {
    if (!this.db) {
      await this.abrirConexion(); // Asegúrate de que la conexión esté abierta antes de realizar la consulta
    }
    const sql = `INSERT INTO ${this.TABLE_NAME} (${this.COL_CITA}, ${this.COL_AUTOR}) VALUES (?, ?)`;
    await this.db.run(sql, [cita.frase, cita.autor]);
    window.dispatchEvent(new Event('storage')); // Dispara un evento de 'storage' para notificar cambios
  }

  async eliminarCita(id: number) {
    if (!this.db) {
      await this.abrirConexion(); // Asegúrate de que la conexión esté abierta antes de realizar la consulta
    }
    const sql = `DELETE FROM ${this.TABLE_NAME} WHERE id = ?`;
    await this.db.run(sql, [id]);
    window.dispatchEvent(new Event('storage')); // Dispara un evento de 'storage' para notificar cambios
  }
}
