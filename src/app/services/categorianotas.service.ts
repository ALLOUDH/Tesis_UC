import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaNotasDTO } from '../dtos/categorianotas.dto';
import { appsetings } from './auth.connection.services';

@Injectable({
  providedIn: 'root'
})
export class CategorianotasService {
  //private baseUrl = 'http://localhost:5010/api/EsquemaDeEvaluacion';
  private baseUrl:String = appsetings.apiUrl + 'EsquemaDeEvaluacion';


  constructor(private http: HttpClient) { }

  getCategorias(): Observable<CategoriaNotasDTO[]> {
    return this.http.get<CategoriaNotasDTO[]>(`${this.baseUrl}/categorias`);
  }

  createCategoria(categoria: CategoriaNotasDTO): Observable<CategoriaNotasDTO> {
    return this.http.post<CategoriaNotasDTO>(`${this.baseUrl}/categorias`, categoria);
  }

  updateCategoria(categoria: CategoriaNotasDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/categorias/${categoria.idcategoriaNotas}`, categoria);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categorias/${id}`);
  }
}
