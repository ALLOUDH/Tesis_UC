import { Injectable } from '@angular/core';
import { appsetings } from './auth.connection.services';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotasPadreService {

  private baseUrl:String = appsetings.apiUrl;

  constructor(private http: HttpClient) {}

  registrarNotasPadre(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}NotasApoderado/RegistrarNotasPadre`, data);
  }

  obtenerNotasPadre(idGrado: number, idBimestre: number, idPeriodo: number): Observable<any> {
    return this.http.get(`${this.baseUrl}NotasApoderado/ObtenerNotasPadre/${idGrado}/${idBimestre}/${idPeriodo}`);
  }

  actualizarNotasPadre(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}NotasApoderado/ActualizarNotasPadre`, data);
  }

}
