export class LoginDTO {
    DNI!: string;
    password!: string;
    constructor() {
        this.DNI = '';
        this.password = '';
    }
}