import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LoginService } from "../services";
import { TipoUsuario } from "../shared";
import { map } from "rxjs/operators";

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const requiredRole = route.data["requiredRole"] as TipoUsuario;

  return loginService.obterDadosDaSessaoObservable().pipe(
    map((sessao) => {
      if (!sessao) {
        router.navigate(["/auth/login"]);
        return false;
      }
      if (sessao.usuarioTipo !== requiredRole) {
        if (sessao.usuarioTipo === TipoUsuario.Cliente) {
          router.navigate(["/client/home"]);
        } else if (sessao.usuarioTipo === TipoUsuario.Funcionario) {
          router.navigate(["/adm/home"]);
        }
        return false;
      }
      return true;
    })
  );
};
