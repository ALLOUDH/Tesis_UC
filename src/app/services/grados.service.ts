import { Injectable } from "@angular/core";
import { OthersDTO, OthersIntDTO } from "../dtos/other.dto";

@Injectable({
    providedIn: 'root'
})
export class GradoAcademicoService {
    othersGradoAcademico: OthersIntDTO[] = [
        {
            id: 1,
            nombre: '1ro de Secundaria' 
        },
        { 
            id: 2, 
            nombre: '2do de Secundaria' 
        },
        {
            id: 3,
            nombre: '3ro de Secundaria' 
        },
        { 
            id: 4, 
            nombre: '4to de Secundaria' 
        },
        {
            id: 5,
            nombre: '5to de Secundaria'
        }
    ]

    constructor() { }
    ObtenerGradoAcademico(){
        return this.othersGradoAcademico;
    }
}