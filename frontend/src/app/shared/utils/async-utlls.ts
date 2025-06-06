import { lastValueFrom, Observable, catchError, throwError } from "rxjs";

export class AsyncUtils {
  static async awaitObservable<T>(observable: Observable<T>): Promise<T> {
    const handledObservable = observable.pipe(
      catchError((error) => {
        let friendlyMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
        if (error?.status) {
          switch (error.status) {
            case 400:
              friendlyMessage = 'Requisição inválida. Por favor, verifique os dados enviados.';
              break;
            case 401:
              friendlyMessage = 'Não autorizado. Faça login novamente.';
              break;
            case 403:
              friendlyMessage = 'Acesso negado. Você não tem permissão para realizar esta ação.';
              break;
            case 404:
              friendlyMessage = 'Recurso não encontrado.';
              break;
            case 500:
              friendlyMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
              break;
          }
        }

        return throwError(() => ({ ...error, friendlyMessage }));
      })
    );
    return await lastValueFrom(handledObservable);
  }
}