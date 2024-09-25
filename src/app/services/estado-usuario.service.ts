import { Injectable } from "@angular/core";
import { OthersDTO, OthersIntDTO } from "../dtos/other.dto";

@Injectable({
    providedIn: 'root'
})
export class EstadoUsuarioService {
    othersEstadoUsuario: OthersIntDTO[] = [
        {
            id: true,
            nombre: 'Activo' 
        },
        { 
            id: false, 
            nombre: 'Inactivo' 
        },
    ]

    constructor() { }
    ObtenerEstadoUsuario(){
        return this.othersEstadoUsuario;
    }
}