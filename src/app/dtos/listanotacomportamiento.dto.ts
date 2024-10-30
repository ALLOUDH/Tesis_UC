export interface NotasPorAlumnoDTO {
    idalumno: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    notas: { [key: number]: number | null };  // key: idTipoNota, value: nota o null si no existe
    promedio: number;
  }