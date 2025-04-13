import { Injectable } from '@angular/core';
import { Cliente } from '../shared/models/cliente.model';
import { ServiceCrudBase } from './service-crud-base/service-crud-base';

const LS_CHAVE = "clientes";

@Injectable({
	providedIn: 'root'
})
export class ClienteService extends ServiceCrudBase<Cliente> {

	constructor() {
		super(LS_CHAVE);
	}

	getClienteByEmail(email: string): Cliente | undefined {
		const clientes = this.listarTodos();
		return clientes.find(cliente => cliente.email === email);
	}
}
