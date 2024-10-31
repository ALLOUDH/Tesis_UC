export class ListaAlumnosDTO {
    usDni!: string;
    usEmail!: string;
    usNombre!: string;
    usApellidoPaterno!: string;
    usApellidoMaterno!: string;
    usSexo!: boolean;
    usCelular!: string;
    usEstado!: boolean;
    usContrasena?: string;
    usFechaRegistro!: Date;
    alInstitucion!: string;
    alCodigoAlumno!: string;
    alDireccion!: string;
    alApellidoPaternoApoderado!: string;
    alApellidoMaternoApoderado!: string;
    alNombreApoderado!: string;
    alOcupacionApoderado!: string;
    alPensionApoderado!: number;
    idgrado!: number;
    idusuario!: number;
    idalumno!: number;
    idperiodo!: number;
}