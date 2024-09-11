import { PadresAlumnosDTO } from "./padres.dtos";

export class AlumnosDTO {
    id!: number;
    Nombre!: string;
    ApellidoPaterno!: string;
    ApellidoMaterno!: string;
    DNI!: string;
    Grado!: string;
    Institucion!: string;
    Email!: string;
    Celular?: string;
    Password!: string;
    Genero!: boolean;
    Padres!: PadresAlumnosDTO[];
}