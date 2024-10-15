import { Injectable, inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { appsetings } from './auth.connection.services';

@Injectable({
  providedIn: 'root',
})
export class PasswordRecoveryService {
 

  private baseUrl:String = appsetings.apiUrl;

  constructor(private http: HttpClient) {}

  solicitarRecuperacion(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}RecuperarPassword/SolicitarRecuperacion`, { email: email });
  }

  verificarCodigo( codigo: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}RecuperarPassword/VerificarCodigo`, { codigo: codigo });
  }

  restablecerContrasena(data: { token: string, nuevaContrasena: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}RecuperarPassword/Restablecer`, data);
  }
}
