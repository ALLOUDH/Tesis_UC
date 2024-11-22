import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NotaAcademicaDTO,PromedioDTO,AlumnoNotaDTO, NotaDTO } from '../dtos/nota-academica.dto';
import { appsetings } from './auth.connection.services';


@Injectable({
  providedIn: 'root'
})
export class NotasAcademicasService {


  private baseUrl:String = appsetings.apiUrl;

  constructor(private http: HttpClient) {}

  // Registrar notas
  registrarNotas(usuarioId: number, notasDto: NotaAcademicaDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}NotasAcademicas/RegistrarNotas?usuarioId=${usuarioId}`, notasDto);
  }

  // Actualizar notas
  actualizarNotas(usuarioId: number, notasDto: NotaAcademicaDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}NotasAcademicas/ActualizarNotas?usuarioId=${usuarioId}`, notasDto);
  }

  // Obtener notas auxiliares por filtros
  obtenerNotasAuxiliares(
  idGrado: number,
  idUnidad: number,
  idBimestre: number,
  idPeriodo: number,
  idSemana?: number // Parámetro opcional
): Observable<AlumnoNotaDTO[]> {
  let url = `${this.baseUrl}NotasAcademicas/ObtenerNotasAuxiliares?idGrado=${idGrado}&idUnidad=${idUnidad}&idBimestre=${idBimestre}&idPeriodo=${idPeriodo}`;

  if (idSemana !== undefined && idSemana !== null) {
    url += `&idSemana=${idSemana}`;
  }

  return this.http.get<AlumnoNotaDTO[]>(url);
}


  guardarOActualizarPromedios(promedios: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}NotasAcademicas/GuardarOActualizarPromedios`, promedios);
  }

  obtenerPromediosPorSemana(
    idUnidad: number,
    idBimestre: number,
    idPeriodo: number,
    idAsignatura: number
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}NotasAcademicas/ObtenerPromediosPorSemana?idUnidad=${idUnidad}&idBimestre=${idBimestre}&idPeriodo=${idPeriodo}&idasignatura=${idAsignatura}`
    );
  }

  obtenerPromediosPorUnidad(
    idGrado: number,
    idBimestre: number,
    idPeriodo: number,
    idAsignatura: number
  ): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}NotasAcademicas/ObtenerPromediosPorUnidad?idGrado=${idGrado}&idBimestre=${idBimestre}&idPeriodo=${idPeriodo}&idAsignatura=${idAsignatura}`
    ).pipe(
      tap((response) => console.log('Respuesta de la API:', response))
    );
  }
  
  
  obtenerGradosYAsignaturas(usuarioId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}NotasAcademicas/ObtenerGradosYAsignaturas?usuarioId=${usuarioId}`);
  }

  obtenerPromediosPorAsignaturaYBimestre(idAlumno: number, idPeriodo: number): Observable<any> {
    return this.http.get(`${this.baseUrl}NotasAcademicas/obtenerPromediosPorAsignaturaYBimestre?idAlumno=${idAlumno}&idPeriodo=${idPeriodo}`);

  }


  obtenerIdAlumnoPorUsuario(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}NotasAcademicas/ObtenerIdAlumnoPorUsuario/${idUsuario}`);
  }
}
