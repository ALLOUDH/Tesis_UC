import { Injectable } from "@angular/core";
import { OthersDTO, OthersIntDTO } from "../dtos/other.dto";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SexoService {
    othersSexo: OthersIntDTO[] = [
        {
            id: true,
            nombre: 'Masculino' 
        },
        { 
            id: false, 
            nombre: 'Femenino' 
        },
    ]

    constructor() { }

    ObtenerSexo(){
        return this.othersSexo;
    }
}