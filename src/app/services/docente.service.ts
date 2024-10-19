import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocentesDTO } from '../dtos/docentes.dto';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private baseUrl = 'http://localhost:5010/api/Vistas';

  constructor(private http: HttpClient) {}

  // Obtener todos los docentes
  obtenerDocentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ObtenerDocentes`);
  }

  // Editar un docente
  editarDocente(idDocente: number, docente: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/EditarDocente/${idDocente}`, docente);
  }

  eliminarDocente(IdDocente: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/EliminarDocente/${IdDocente}`);
  }
  
}
