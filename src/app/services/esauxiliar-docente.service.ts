import { Injectable } from "@angular/core";
import { OthersDTO, OthersIntDTO } from "../dtos/other.dto";

@Injectable({
    providedIn: 'root'
})
export class AuxiliarService {
    othersAuxiliarDocente: OthersIntDTO[] = [
        {
            id: true,
            nombre: 'Si' 
        },
        { 
            id: false, 
            nombre: 'No' 
        },
    ]

    constructor() { }
    ObtenerAuxiliarDocente(){
        return this.othersAuxiliarDocente;
    }
}