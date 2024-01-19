import { Component, ElementRef, Input, type OnDestroy, type OnInit, ViewEncapsulation } from '@angular/core';
import { ModalService } from "../../services/modal.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id?: string;
  isOpen = false;
  private element: any;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    this.modalService.add(this);

    document.body.appendChild(this.element);

    this.element.addEventListener('click', (el: any) => {
      if (el.target.className === 'app-modal') {
        this.close()
      }
    });
  }

  ngOnDestroy() {
    this.modalService.remove(this)

    this.element.remove()
  }

  open() {
    this.element.style.display = 'block';
    document.body.classList.add('jw-modal-open')
    this.isOpen = true;
  }

  close() {
    this.element.style.display = 'none'
    document.body.classList.remove('app-modal-open')
    this.isOpen = false;
  }
}
