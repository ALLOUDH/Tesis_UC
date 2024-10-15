import { AuditoriaDTO } from "../../dtos/auditoria.dto";

export class LoginDTO {
    DNI!: string;
    password!: string;
    AuditoriaDTO!: AuditoriaDTO;
    
    constructor() {
        this.DNI = '';
        this.password = '';
        this.AuditoriaDTO = new AuditoriaDTO();
    }
}