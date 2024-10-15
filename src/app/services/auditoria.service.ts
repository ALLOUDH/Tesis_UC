import { Injectable } from '@angular/core';
import { appsetings } from './auth.connection.services';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseAppDTO } from '../auth/auth-dtos/responseapp.dto';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  private baseUrl:String = appsetings.apiUrl;

  constructor(private http: HttpClient) { }

  registrarComentario(objeto: any): Observable<ResponseAppDTO> {
    return this.http.post<ResponseAppDTO>(`${this.baseUrl}Auditoria/RegistroComentarios`, objeto);
  }

  registrarIncidencia(objeto: any): Observable<ResponseAppDTO> {
    return this.http.post<ResponseAppDTO>(`${this.baseUrl}Auditoria/RegistroIncidencias`, objeto);
  }

  // Método para obtener el total de usuarios
  obtenerTotalUsuarios(): Observable<{ 
    totalUsuarios: number; 
    totalAlumnos: number; 
    totalDocentes: number; 
    totalAdministradores: number
  }> {
    return this.http.get<{ 
      totalUsuarios: number; 
      totalAlumnos: number; 
      totalDocentes: number; 
      totalAdministradores: number 
    }>(`${this.baseUrl}Auditoria/TotalUsuarios`);
  }

  // Método para obtener el total de incidencias y comentarios
  obtenerTotalIncidenciasComentarios(): Observable<{
    totalIncidencias: number;
    totalIncidenciasResueltas: number;
    totalIncidenciasPendientes: number; 
    totalComentarios: number
  }> {
    return this.http.get<{
      totalIncidencias: number; 
      totalIncidenciasResueltas: number; 
      totalIncidenciasPendientes: number; 
      totalComentarios: number
    }>(`${this.baseUrl}Auditoria/TotalIncidenciasComentarios`);
  }
}
