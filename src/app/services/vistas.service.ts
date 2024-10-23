import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsetings } from './auth.connection.services';
import { Observable } from 'rxjs';
import { ListaAlumnosDTO } from '../dtos/lista-alumnos.dto';
import { ListaDocentesDTO } from '../dtos/lista-docentes.dto';

@Injectable({
  providedIn: 'root'
})
export class VistasService {

  private baseUrl: String = appsetings.apiUrl;

  constructor(private http: HttpClient) { }

  obtenerAlumnos(): Observable<any[]> {
    return this.http.get<ListaAlumnosDTO[]>(`${this.baseUrl}Vistas/ObtenerAlumnos`);
  }

  cambiarEstadoAlumno(id: number, nuevoEstado: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}Vistas/${id}`, nuevoEstado);
  }

  obtenerDocentes(): Observable<any[]> {
    return this.http.get<ListaDocentesDTO[]>(`${this.baseUrl}Vistas/ObtenerDocentes`);
  }

  cambiarEstadoDocente(id: number, nuevoEstado: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}Vistas/CambiarEstadoDocente/${id}`, nuevoEstado);
  }

  cambiarAuxiliarDocente(id: number, nuevoAuxiliar: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}Vistas/CambiarAuxiliarDocente/${id}`, nuevoAuxiliar);
  }
}
