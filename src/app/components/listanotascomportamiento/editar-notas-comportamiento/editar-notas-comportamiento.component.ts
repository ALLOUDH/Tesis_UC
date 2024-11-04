import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotasPorAlumnoDTO } from '../../../dtos/listanotacomportamiento.dto';
import { TipoNotasDTO } from '../../../dtos/tiponotas.dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-notas-comportamiento',
  templateUrl: './editar-notas-comportamiento.component.html',
  styleUrl: './editar-notas-comportamiento.component.css'
})
export class EditarNotasComportamientoComponent {
  notasForm: FormGroup;
  @Input() alumno!: NotasPorAlumnoDTO;
  @Input() tiposDeNota: TipoNotasDTO[] = [];
  @Output() notasActualizadas = new EventEmitter<{ [idTipoNota: number]: number }>();
  
  constructor(
    private modalRef: BsModalRef,
  ) {
    this.notasForm = new FormGroup({

    });
  }

  ngOnInit(): void {
    // Crear los controles de cada tipo de nota en el formulario
    this.tiposDeNota.forEach(tipo => {
      const control = new FormControl(this.alumno.notas[tipo.idtipoNotas] || 0, [Validators.min(0), Validators.max(20)]);
      this.notasForm.addControl(tipo.idtipoNotas.toString(), control);
    });
  }
  guardarCambios(): void {
    if (this.notasForm.valid) {
        Swal.fire({
            title: '¿Está seguro?',
            text: "¿Desea guardar los cambios realizados?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const notasActualizadas = this.notasForm.value;
                this.notasActualizadas.emit(notasActualizadas); 
                this.cerrarModal();
            }
        });
    }
}

  cerrarModal(): void {
    this.modalRef.hide();
  }
}
