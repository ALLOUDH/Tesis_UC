import { ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { RecoverpassComponent } from '../recoverpass/recoverpass.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private router: Router,
    private bsModalRecoverPass: BsModalRef,
    private modalService: BsModalService,
  ) {

  }

  Login() {
    this.router.navigate(['/dashboard']).then(() => {
      window.location.reload();
    });
  }

  AbrirModalRecoverPass() {
    this.bsModalRecoverPass = this.modalService.show(RecoverpassComponent, {backdrop: 'static', class: 'modal-dialog-centered'});
  }
}
