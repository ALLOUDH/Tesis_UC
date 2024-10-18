// src/app/services/asignatura.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsignaturaDTO } from '../dtos/asignatura.dto';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {
  private apiUrl = 'http://localhost:5010/api/PlanEstudio/asignatura';

  constructor(private http: HttpClient) { }

  // Crear una nueva asignatura
  createAsignatura(asignatura: AsignaturaDTO): Observable<AsignaturaDTO> {
    return this.http.post<AsignaturaDTO>(this.apiUrl, asignatura);
  }

  // Obtener todas las asignaturas
  getAsignaturas(): Observable<AsignaturaDTO[]> {
    return this.http.get<AsignaturaDTO[]>(this.apiUrl);
  }

  // Actualizar una asignatura existente
  updateAsignatura(asignatura: AsignaturaDTO): Observable<AsignaturaDTO> {
    return this.http.put<AsignaturaDTO>(`${this.apiUrl}/${asignatura.idasignatura}`, asignatura);
  }

  // Eliminar una asignatura
  deleteAsignatura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
