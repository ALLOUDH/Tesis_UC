export interface NotasPorUnidadDTO {
    idunidad: number;
    notasPorTipo: { [idTipoNota: number]: number | null }; // key: idTipoNota, value: nota
  }
  
  export interface AlumnoNotaComportamientoDTO {
    idalumno: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    notasPorUnidad: NotasPorUnidadDTO[]; // Lista de notas agrupadas por unidad
  }