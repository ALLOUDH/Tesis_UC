export interface PromedioPorBimestreDTO {
    bimestre: string; 
    promedio: number | null; 
  }
  
  export interface AsignaturaDTO {
    asignatura: string; 
    promediosPorBimestre: PromedioPorBimestreDTO[];
  }
  
  export interface AreasDTO {
    area: string; 
    asignaturas: AsignaturaDTO[]; 
  }
  
  export interface RespuestaNotasDTO {
    idAlumno: number;
    nombre: string; 
    apellidoPaterno: string; 
    apellidoMaterno: string; 
    promedios: AreasDTO[];
  }
  