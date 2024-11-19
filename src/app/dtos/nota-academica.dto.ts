export interface NotaDTO {
    idAlumno: number;
    notNotaNumerica: number;
    notFechaRegistro: string;
}

export interface NotaAcademicaDTO {
    idGrado: number;
    idAsignatura: number;
    idUnidad: number;
    idBimestre: number;
    idPeriodo: number;
    idSemana: number;
    idtipoNotas: number;
    notas: NotaDTO[];
}

export interface AlumnoNotaDTO {
    idAlumno: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    notas: { [semana: number]: { [tipoNotaId: number]: number | null }; };
}

export interface PromedioDTO {
    idAlumno: number;
    idAsignatura: number;
    idUnidad?: number;
    idBimestre?: number;
    idPeriodo: number;
    valorPromedio: number;
}