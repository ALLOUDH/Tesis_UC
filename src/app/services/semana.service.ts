import { Injectable } from "@angular/core";
import { OthersDTO, OthersIntDTO } from "../dtos/other.dto";

@Injectable({
    providedIn: 'root'
})
export class SemanaAcademicoService {
    othersSemanaAcademica: OthersIntDTO[] = [
        {
            id: 1,
            nombre: 'Semana 1' 
        },
        { 
            id: 2, 
            nombre: 'Semana 2' 
        },
        {
            id: 3,
            nombre: 'Semana 3' 
        },
        { 
            id: 4, 
            nombre: 'Semana 4' 
        }
    ]

    constructor() { }
    ObtenerSemanaAcademico(){
        return this.othersSemanaAcademica;
    }
}