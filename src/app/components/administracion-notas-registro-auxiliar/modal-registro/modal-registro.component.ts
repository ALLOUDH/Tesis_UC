import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.component.html',
  styleUrl: './modal-registro.component.css'
})
export class ModalRegistroComponent {
  formData: any; 

  constructor(
    public bsModalRef: BsModalRef,
    private router: Router,

  ) {}

    cerrarModal(): void {
      this.bsModalRef.hide();
    }
  
    irANotasPorSemana(): void {
      this.router.navigate(['/registro-notas-academicas'], { state: { data: this.formData } });
      this.bsModalRef.hide();
    }
  
    irANotasPorUnidad(): void {
      this.router.navigate(['/registro-notas-academicas-unidad'], { state: { data: this.formData } });
      this.bsModalRef.hide();
    }
  

}
