export class AsignarDocenteDTO { 
    IdAsignar!: number; 
    IdDocente?: number; 
    IdGrado?: number; 
    IdAsignaturas: number[] = []; 
}