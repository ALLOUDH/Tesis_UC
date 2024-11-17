export interface NotasPorBimestreDTO {
    idbimestre: number;
    notasPorTipo: { [idTipoNota: number]: number | null }; // key: idTipoNota, value: nota
}

export interface AlumnoNotaPadreDTO {
    idalumno: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    notasPorBimestre: NotasPorBimestreDTO[]; // Lista de notas agrupadas por bimestre
}