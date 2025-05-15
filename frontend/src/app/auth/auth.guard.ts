import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LoginService } from "../services";
import { TipoUsuario } from "../shared/models";

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const sessao = loginService.obterDadosDaSessao();
  const requiredRole = route.data["requiredRole"] as TipoUsuario;

  if (!sessao) {
    router.navigate(["/auth/login"]);
    return false;
  }

  // Se estiver logado, mas com o tipo incorreto, vai para a respectiva pagina inicial (pode ser mudado depois)
  if (sessao.usuarioTipo !== requiredRole) {
    if (sessao.usuarioTipo === TipoUsuario.Cliente) {
      router.navigate(["/client/home"]);
      return false;
    }

    if (sessao.usuarioTipo === TipoUsuario.Funcionario) {
      router.navigate(["/adm/home"]);
      return false;
    }
  }

  return true;
};
