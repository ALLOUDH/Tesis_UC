export interface VerIncidenciaDTO {
    idauditoriaIncidencia: number;
    audincTituloIncidencia: string;
    audincDescripcionIncidencia: string;
    audincEstadoIncidencia: boolean;
    audincFechaCreacion: string;
    auditoria: {
        idauditoria: number;
        audTipoEvento: string;
        idusuario: number;
        audDireccionIp: string | null;
        audFechaCreacion: string;
        usuario: {
            nombre: string;
            apellidoPaterno: string;
            apellidoMaterno: string;
          };
    };
}