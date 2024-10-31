import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsistenciaDTO } from '../dtos/asistencia.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private baseUrl = 'http://localhost:5010/api/Asistencia';

  constructor(private http: HttpClient) { }

  // Crear una nueva asistencia
  createAsistencia(asistencias: AsistenciaDTO[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/RegistrarAsistencia`, asistencias);
  }

  // Obtener todas las asistencias por fechas
  obtenerAsistenciaPorFecha(fecha: string): Observable<AsistenciaDTO[]> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<AsistenciaDTO[]>(`${this.baseUrl}/ObtenerAsistenciaPorFecha`, { params });
  }

  updateAsistencia(asistencias: AsistenciaDTO[]): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/ActualizarAsistencia`, asistencias);
  }

}
