// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { appsetings } from './auth.connection.services';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //private apiUrl = 'http://localhost:5010/api/acceso';
  private apiUrl:String = appsetings.apiUrl + 'acceso';
 

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllUsuarios`); // Cambia la ruta según tu endpoint
  }

  // Método para contar usuarios por rol
  getUsuariosCountByRole(role: string): Observable<number> {
    return this.getUsuarios().pipe(
      map(usuarios => usuarios.filter(user => user.usRol === role).length) // Filtra por rol
    );
  }
}
