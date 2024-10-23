import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoNotasDTO } from '../dtos/tiponotas.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiponotasService {
  private baseUrl = 'http://localhost:5010/api/EsquemaDeEvaluacion/tipos';

  constructor(private http: HttpClient) { }

  // Crear un nuevo tipo de nota
  createTipoNota(tiponota: TipoNotasDTO): Observable<TipoNotasDTO> {
    return this.http.post<TipoNotasDTO>(this.baseUrl, tiponota);
  }

  // Obtener todos los tipo de nota
  getTiposNota(): Observable<TipoNotasDTO[]> {
    return this.http.get<TipoNotasDTO[]>(this.baseUrl);
  }

  // Actualizar un tipo de nota
  updateTipoNota(tiponota: TipoNotasDTO): Observable<TipoNotasDTO> {
    return this.http.put<TipoNotasDTO>(`${this.baseUrl}/${tiponota.idtipoNotas}`, tiponota);
  }

  // Eliminar un tipo de nota
  deleteTipoNota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
