import { Injectable } from "@angular/core";
import { OthersDTO } from "../dtos/other.dto";

@Injectable({
    providedIn: 'root'
})
export class UserRoleService {
    othersUserRole: OthersDTO[] = [
        {
            id: 'Estudiante',
            nombre: 'Estudiante' 
        },
        { 
            id: 'Docente', 
            nombre: 'Docente' 
        },
        {
            id: 'Padre',
            nombre: 'Padre'
        }
    ]

    constructor() { }

    ObtenerUserRole(){
        return this.othersUserRole;
    }
}