export interface VerComentarioDTO {
    idauditoria: number;
    audcomComentario: string;
    audcomFechaCreacion: string;
    auditoria: {
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