import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccesoService } from '../../../services/acceso.service';
import { PrimerAccesoDTO } from '../../auth-dtos/primer-acceso.dto';
import { PasswordValidatorService } from '../../../services/password-validator.service';

@Component({
  selector: 'app-primer-acceso',
  templateUrl: './primer-acceso.component.html',
  styleUrl: './primer-acceso.component.css'
})
export class PrimerAccesoComponent {
  primeraccesoform: FormGroup;

  constructor
    (
      private accesService: AccesoService,
      private formBuilder: FormBuilder,
      private modalService: BsModalService,
      private bsModalPrimerAcceso: BsModalRef,
      private passwordValidatorService: PasswordValidatorService,
    ) {
    this.primeraccesoform = new FormGroup({
      inputCorreoElectronico: new FormControl('', [Validators.required, Validators.email]),
      inputPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidatorService.validatePassword
      ]),
      inputConfirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator });
  }

  // Método para validar que la contraseña ingresada es igual a la de confirmar contraseña
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const password = group.get('inputPassword')?.value;
    const confirmPassword = group.get('inputConfirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  // Método para verificar si hay un error de coincidencia de contraseñas
  get passwordMismatch() {
    return this.primeraccesoform.hasError('mismatch') && this.primeraccesoform.get('inputConfirmPassword')?.touched;
  }

  // Propiedad que permite obtener los controles del formulario de alumnos
  get Controls() {
    return this.primeraccesoform?.controls;
  }

  GuardarDatos() {
    const DatosPrimerAcceso: PrimerAccesoDTO = {
      Idusuario: this.accesService.getUserID() || 0,
      usEmail: this.primeraccesoform.get('inputCorreoElectronico')?.value,
      password: this.primeraccesoform.get('inputPassword')?.value,
    };

    if (this.primeraccesoform.valid) {
      this.accesService.actualizarDatosPrimerAcceso(DatosPrimerAcceso).subscribe(Response => {
        if (Response.isSuccess) {
          this.MostrarMensajeExito('Datos guardados correctamente', 'Éxito');
          this.bsModalPrimerAcceso.hide();
        } else {
          this.MostrarMensajeError('Hubo un error al guardar los datos', 'Error');
        }
      });
    } else {
      this.MostrarMensajeError('Por favor, complete los campos correctamente', 'Error');
    }
    console.log(DatosPrimerAcceso);
  }

  CerrarModal() {
    this.MensajeAlerta("Estas segur@ de volver al inicio?", "No podrás deshacer esta acción!");
  }

  MostrarMensajeExito(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'success',
      showConfirmButton: false,
      timer: 2300,
      timerProgressBar: true
    });
  }

  MostrarMensajeError(mensaje: string, titulo: string) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: "error"
    });
  }

  MensajeAlerta(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0B5ED7",
      cancelButtonColor: "#BB2D3B",
      confirmButtonText: "Si, cancelar",
      cancelButtonText: "No, continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          confirmButtonColor: "#0B5ED7",
        });
        this.bsModalPrimerAcceso.hide();
      }
    });
  }
}
