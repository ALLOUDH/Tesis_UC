// src/app/services/area.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AreaDTO } from '../dtos/area.dto';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private baseUrl = 'http://localhost:5010/api/PlanEstudio';

  constructor(private http: HttpClient) { }

  getAreas(): Observable<AreaDTO[]> {
    return this.http.get<AreaDTO[]>(`${this.baseUrl}/areas`);
  }

  createArea(area: AreaDTO): Observable<AreaDTO> {
    return this.http.post<AreaDTO>(`${this.baseUrl}/areas`, area);
  }

  updateArea(area: AreaDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/areas/${area.idArea}`, area);
  }

  deleteArea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/areas/${id}`);
  }
}
