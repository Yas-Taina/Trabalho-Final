import { Component, inject, signal, TemplateRef, WritableSignal, ViewChild, AfterViewInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-modal',
	standalone: true,
	imports: [],
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.css']
})
export class ModalComponent implements AfterViewInit {
	private modalService = inject(NgbModal);
	closeResult: WritableSignal<string> = signal('');
  texto: string = 'Texto do modal';

	@ViewChild('content') content!: TemplateRef<any>;

	ngAfterViewInit() {
		// Ensuring ViewChild is initialized before use.
	}

	open(texto: string) {
    this.texto = texto;
		if (!this.content) {
			console.error('Modal content is not initialized.');
			return;
		}

		this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult.set(`Closed with: ${result}`);
			},
			(reason) => {
				this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
			}
		);
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}
}
