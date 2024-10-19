import { AsignarDocenteDTO } from "./asignardocente.dto";

export class DocentesDTO {
    UsDni!: string;
    UsContrasena!: string;
    UsRol!: string;
    UsEmail?: string;
    UsNombre!: string;
    UsApellidoPaterno!: string;
    UsApellidoMaterno!: string;
    UsSexo!: boolean;
    UsFechaRegistro!: Date;
    UsCelular?: string;
    UsEstado!: boolean;
    DoEspecialidad!: string;
    DoGradoAcademico!: string;
    DoEsAuxiliar!: boolean;
    Idusuario?: number; 
    Iddocente?: number; 

    // Lista de asignaciones
    Asignaciones: AsignarDocenteDTO[] = []; // Inicializado como una lista vacía
}
