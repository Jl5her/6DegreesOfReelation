import { Component } from '@angular/core';
import { __addDisposableResource } from "tslib";
import { ModalService } from "./services/modal.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected readonly __addDisposableResource = __addDisposableResource;

  constructor(public modalService: ModalService) {
  }

  protected showHelp() {
    this.modalService.open('modal-1')
  }
}
