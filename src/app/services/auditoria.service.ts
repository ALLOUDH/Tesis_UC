import { Injectable } from '@angular/core';
import { appsetings } from './auth.connection.services';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseAppDTO } from '../auth/auth-dtos/responseapp.dto';
import { VerComentarioDTO } from '../dtos/ver-comentario.dto';

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

  obtenerComentarios(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Auditoria/ObtenerComentarios?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  eliminarComentario(idComentario: number): Observable<ResponseAppDTO> {
    return this.http.delete<ResponseAppDTO>(`${this.baseUrl}Auditoria/EliminarComentario/${idComentario}`);
  }

  obtenerIncidencias(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Auditoria/ObtenerIncidencias?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  actualizarEstadoIncidencia(idIncidencia: number, nuevoEstado: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}Auditoria/ActualizarEstadoIncidencia/${idIncidencia}`, nuevoEstado);
  }

  obtenerUsuarioPorId(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Auditoria/ObtenerUsuarioPorId/${idUsuario}`);
  }
}
