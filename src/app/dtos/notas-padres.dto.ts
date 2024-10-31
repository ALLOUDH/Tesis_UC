export interface NotasPadresDTO {
    idbimestre: number;
    idtipoNotas: number;
    idgrado: number;
    notas: NotaDTO[];
}

export interface NotaDTO {
    idalumno: number;
    notNotaNumerica: number;
}

export interface NotasPorPadreDTO {
    idalumno: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    notas: { [key: number]: number | null };  // key: idTipoNota, value: nota o null si no existe
    promedio: number;
}