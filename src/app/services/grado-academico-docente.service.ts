import { Injectable } from "@angular/core";
import { OthersDTO, OthersIntDTO } from "../dtos/other.dto";

@Injectable({
    providedIn: 'root'
})
export class GradoAcademicoDocenteService {
    otherGradoAcademicoDocente: OthersIntDTO[] = [
        {
            id: 1,
            nombre: 'Egresado' 
        },
        { 
            id: 2, 
            nombre: 'Bachiller' 
        },
        {
            id: 3,
            nombre: 'Titulo Profesional' 
        },
        { 
            id: 4, 
            nombre: 'Maestria' 
        },
        {
            id: 5,
            nombre: 'Doctorado'
        },
        {
            id: 6,
            nombre: 'Postdoctorado'
        }
    ]

    constructor() { }
    ObtenerGradoAcademicoDocente(){
        return this.otherGradoAcademicoDocente;
    }
}