import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsistenciaDTO } from '../dtos/asistencia.dto';
import { map, Observable } from 'rxjs';
import { ResumenAsistenciaDTO } from '../dtos/resumenasistencia.dto';
import { appsetings } from './auth.connection.services';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  //private baseUrl = 'http://localhost:5010/api/Asistencia';
  private baseUrl:String = appsetings.apiUrl + 'Asistencia';


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

  // Obtener el resumen de asistencia 
  obtenerResumenAsistencia(ano: string, idAlumno: number): Observable<ResumenAsistenciaDTO[]> {
    const params = new HttpParams()
      .set('ano', ano)
      .set('idAlumno', idAlumno.toString());
    return this.http.get<ResumenAsistenciaDTO[]>(`${this.baseUrl}/ObtenerResumenAsistenciaPorAno`, { params });
  }

  // Obtener el resumen de asistencia por alumno
  obtenerResumenAsistenciaAlumno(ano: string, idAlumno: number): Observable<ResumenAsistenciaDTO[]> {
    const params = new HttpParams()
      .set('ano', ano)
      .set('idAlumno', idAlumno.toString());
    return this.http.get<ResumenAsistenciaDTO[]>(`${this.baseUrl}/ObtenerResumenAsistenciaPorAnoYAlumno`, { params });
  }

  // Obtener los años con registros de asistencia
  obtenerAnosConRegistros(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/ObtenerAnosConRegistros`)
      .pipe(
        map((response: string[]) => {
          return response;
        })
      );
  }

}
