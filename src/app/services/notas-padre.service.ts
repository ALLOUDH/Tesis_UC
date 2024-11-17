import { Injectable } from '@angular/core';
import { appsetings } from './auth.connection.services';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlumnoNotaPadreDTO } from '../dtos/ver-nota-padre.dto';

@Injectable({
  providedIn: 'root'
})
export class NotasPadreService {

  private baseUrl:String = appsetings.apiUrl;

  constructor(private http: HttpClient) {}

  registrarNotasPadre(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}NotasApoderado/RegistrarNotasPadre`, data);
  }

  obtenerNotasPadre(idGrado: number, idBimestre: number, idPeriodo: number, idCategoriaNotas: number): Observable<any> {
    return this.http.get(`${this.baseUrl}NotasApoderado/ObtenerNotasPadre/${idGrado}/${idBimestre}/${idPeriodo}/${idCategoriaNotas}`);
  }

  actualizarNotasPadre(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}NotasApoderado/ActualizarNotasPadre`, data);
  }

  obtenerNotasPorAlumno(idAlumno: number, idPeriodo: number) {
    return this.http.get<AlumnoNotaPadreDTO>(`${this.baseUrl}NotasApoderado/ObtenerNotasPorAlumno?idAlumno=${idAlumno}&idPeriodo=${idPeriodo}`);
  }

  obtenerIdAlumnoPorUsuario(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}NotasApoderado/ObtenerIdAlumnoPorUsuario/${idUsuario}`);
  }

}
