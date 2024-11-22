import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeriodoAcademicoDTO } from '../dtos/periodoacademico.dto';
import { appsetings } from './auth.connection.services';

@Injectable({
  providedIn: 'root'
})
export class PeriodoAcademicoService {
  //private baseUrl = 'http://localhost:5010/api/CicloAcademico';
  private baseUrl:String = appsetings.apiUrl + 'CicloAcademico';

  constructor(private http: HttpClient) { }

  getPeriodo(): Observable<PeriodoAcademicoDTO[]> {
    return this.http.get<PeriodoAcademicoDTO[]>(`${this.baseUrl}/periodo`);
  }

  createPeriodo(periodo: PeriodoAcademicoDTO): Observable<PeriodoAcademicoDTO> {
    return this.http.post<PeriodoAcademicoDTO>(`${this.baseUrl}/periodo`, periodo);
  }

  updatePeriodo(periodo: PeriodoAcademicoDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/periodo/${periodo.idperiodo}`, periodo);
  }

  deletePeriodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/periodo/${id}`);
  }
}
