export class DataUtils {
  static obterDataHoraAtualFormatada(): string {
    const dataAtual = new Date();
    const dia = dataAtual.getDate().toString().padStart(2, "0");
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0");
    const ano = dataAtual.getFullYear();
    const horas = dataAtual.getHours().toString().padStart(2, "0");
    const minutos = dataAtual.getMinutes().toString().padStart(2, "0");

    return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
  }
}