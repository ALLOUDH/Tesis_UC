export interface NotaDTO {
    idalumno: number;
    NotFechaRegistro: string; 
    NotNotaNumerica: number;
}

export interface NotaComportamientoDTO {
    IdasignarDocente?: number | null;
    IdtipoNotas: number;
    Idunidad: number;
    Idgrado: number;
    Notas: NotaDTO[];
}

