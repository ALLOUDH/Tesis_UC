import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaAcademicaDTO,PromedioDTO,AlumnoNotaDTO, NotaDTO } from '../dtos/nota-academica.dto';
import { appsetings } from './auth.connection.services';


@Injectable({
  providedIn: 'root'
})
export class NotasAcademicasService {
  //private baseUrl = 'http://localhost:5010/api/NotasAcademicas';
  private baseUrl:String = appsetings.apiUrl + 'NotasAcademicas';


  constructor(private http: HttpClient) {}

  // Registrar notas
  registrarNotas(usuarioId: number, notasDto: NotaAcademicaDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/RegistrarNotas?usuarioId=${usuarioId}`, notasDto);
  }

  // Actualizar notas
  actualizarNotas(usuarioId: number, notasDto: NotaAcademicaDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/ActualizarNotas?usuarioId=${usuarioId}`, notasDto);
  }

  // Obtener notas auxiliares por filtros
  obtenerNotasAuxiliares(idGrado: number, idSemana: number, idUnidad: number, idBimestre: number, idPeriodo: number): Observable<AlumnoNotaDTO[]> {
    return this.http.get<AlumnoNotaDTO[]>(`${this.baseUrl}/ObtenerNotasAuxiliares?idGrado=${idGrado}&idSemana=${idSemana}&idUnidad=${idUnidad}&idBimestre=${idBimestre}&idPeriodo=${idPeriodo}`);
  }

  // Guardar promedios
  guardarPromedios(promedios: PromedioDTO[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/GuardarPromedios`, promedios);
  }

  // Actualizar promedios
  actualizarPromedios(promedios: PromedioDTO[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/ActualizarPromedios`, promedios);
  }

  obtenerGradosYAsignaturas(usuarioId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/ObtenerGradosYAsignaturas?usuarioId=${usuarioId}`);
  }
}
