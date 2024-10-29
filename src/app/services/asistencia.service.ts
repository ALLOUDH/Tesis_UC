import { HttpClient } from '@angular/common/http';
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
  
  // Obtener todas las asistencias
  getAsistencia(): Observable<AsistenciaDTO[]> {
    return this.http.get<AsistenciaDTO[]>(this.baseUrl);
  }

  // Actualizar una aistencia existente
  updateAsistencia(asistencia: AsistenciaDTO): Observable<AsistenciaDTO> {
    return this.http.put<AsistenciaDTO>(`${this.baseUrl}/${asistencia.idasistencia}`, asistencia);
  }

  // Eliminar una asistencia
  deleteAsistencia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
