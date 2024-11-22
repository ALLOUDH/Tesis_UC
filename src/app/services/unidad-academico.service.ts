import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnidadAcademicaDTO } from '../dtos/unidadacademica.dto';
import { appsetings } from './auth.connection.services';

@Injectable({
  providedIn: 'root'
})
export class UnidadAcademicoService {
  //private baseUrl = 'http://localhost:5010/api/CicloAcademico/unidad';
  private baseUrl: string = appsetings.apiUrl + 'CicloAcademico/unidad';


  constructor(private http: HttpClient) { }

  // Crear una nueva unidad
  createUnidad(unidad: UnidadAcademicaDTO): Observable<UnidadAcademicaDTO> {
    return this.http.post<UnidadAcademicaDTO>(this.baseUrl, unidad);
  }

  // Obtener todas las unidades
  getUnidad(): Observable<UnidadAcademicaDTO[]> {
    return this.http.get<UnidadAcademicaDTO[]>(this.baseUrl);
  }

  // Actualizar una unidad existente
  updateUnidad(unidad: UnidadAcademicaDTO): Observable<UnidadAcademicaDTO> {
    return this.http.put<UnidadAcademicaDTO>(`${this.baseUrl}/${unidad.idunidad}`, unidad);
  }

  // Eliminar una unidad
  deleteUnidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
