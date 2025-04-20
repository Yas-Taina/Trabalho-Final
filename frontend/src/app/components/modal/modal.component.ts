import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./modal.component.html",
  styleUrl: "./modal.component.css",
})
export class ModalComponent {
  @ViewChild("modalTemplate") modalTemplate!: TemplateRef<any>;
  @Input() modalTitle: string = "";
  @Input() contentTemplate!: TemplateRef<any>;
  @Input() templateContext: any = {};

  @Output() confirmed = new EventEmitter<any>();
  private modalRef!: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  open() {
    this.modalRef = this.modalService.open(this.modalTemplate, {
      centered: true,
      size: "lg",
    });
  }

  confirm() {
    this.confirmed.emit(this.templateContext.formData);
    this.close();
  }

  close() {
    this.modalRef?.close();
  }
}
