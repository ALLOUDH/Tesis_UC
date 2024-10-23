export class ListaDocentesDTO {
    usDni!: string;
    usEmail!: string;
    usNombre!: string;
    usApellidoPaterno!: string;
    usApellidoMaterno!: string;
    usSexo!: boolean;
    usCelular!: string;
    usEstado!: boolean;
    usContrasena?: string;

    doEspecialidad!: string;
    doEsAuxiliar!: boolean;
    doGradoAcademico!: string;
    idusuario!: number;
}