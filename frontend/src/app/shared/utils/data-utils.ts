export class DataUtils {
  static obterDataHoraAtualFormatada(): string {
    const dataAtual = new Date();

    return this.obterDataHoraFormatada(dataAtual);
  }

  static obterDataHoraFormatada(date: Date): string {
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const ano = date.getFullYear();
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");

    return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
  }
}