import { Component,} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RecoverpassComponent } from '../recoverpass/recoverpass.component';
import { AccesoService } from '../../services/acceso.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginDTO } from '../auth-dtos/login.dto';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  dataFormGroup: FormGroup;
  LoginDTO = new LoginDTO();

  constructor(
    private router: Router,
    private bsModalRecoverPass: BsModalRef,
    private modalService: BsModalService,
    private AccesoService: AccesoService,

  ) {
    this.LoginDTO = new LoginDTO();
    this.dataFormGroup = new FormGroup({
      inputUsuario: new FormControl('', [Validators.required]),
      inputPassword: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    if (this.AccesoService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  get Controls() {
    return this.dataFormGroup.controls;
  }

  Login() {
    if (this.dataFormGroup.valid) {
      this.LoginDTO.DNI = this.Controls['inputUsuario'].value;
      this.LoginDTO.password = this.Controls['inputPassword'].value;
      this.LoginDTO.AuditoriaDTO.AudTipoEvento = 'Inicio de sesión';

      this.AccesoService.login(this.LoginDTO).subscribe(
        (response: any) => {
          console.log(response); // Verificar la respuesta completa del servidor
          if (response.isSuccess) {
            if (response.token) {  // Verificar si el token está definido
              localStorage.setItem('usertoken', response.token);
              const decodedToken: any = jwtDecode(response.token);
              if (decodedToken && decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
                localStorage.setItem('userrole', decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']); // Almacena el rol decodificado
                console.log('Rol de usuario', decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
              } else {
                console.error('El token no contiene un rol válido:', decodedToken);
              }
              if (decodedToken && decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/expired'] === 'True') {
                localStorage.setItem('userstatus', decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/expired']);
                console.log('Estado del usuario', decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/expired']);
              } else {
                localStorage.removeItem('usertoken');
                this.MensajeError('Error', 'El usuario esta inactivo, contacte al administrador');
              }
              this.router.navigate(['/dashboard']).then(() => {
                window.location.reload();
              });
            } else {
              this.MensajeError('Error', 'No se recibió un token válido.');
            }
          } else {
            this.MensajeError('Error', 'Usuario o contraseña incorrectos');
          }
        },
        (error) => {
          console.error('Error en el servidor:', error); // Manejar error de red o servidor
          this.MensajeError('Error', 'Ocurrió un error en el servidor');
        }
      );
    }
    console.log(localStorage.getItem('usertoken'));
  }

  MensajeError(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'error',
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true
    });
  }

  AbrirModalRecoverPass() {
    this.bsModalRecoverPass = this.modalService.show(RecoverpassComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
  }
}
