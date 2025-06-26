package br.net.backend.backend.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CookieValue;
import javax.servlet.http.HttpServletResponse;
import io.jsonwebtoken.Claims;

import br.net.backend.backend.repository.ClienteRepository;
import br.net.backend.backend.repository.FuncionarioRepository;
import br.net.backend.backend.model.Funcionario;
import br.net.backend.backend.model.Cliente;
import br.net.backend.backend.utils.CriptografiaUtils;
import br.net.backend.backend.utils.JwtUtils;
import br.net.backend.backend.model.enums.TipoUsuario;

import java.util.Optional;

import lombok.Data;
import lombok.AllArgsConstructor;

// DTO para login
@Data
class LoginRequest {
    private String email;
    private String senha;
}

@Data
@AllArgsConstructor
class LoginResponse {
    private Long usuarioId;
    private TipoUsuario usuarioTipo;
}

@CrossOrigin
@RestController
@RequestMapping("/login")
public class LoginController {
  @Autowired
  private ClienteRepository clienteRepository;

  @Autowired
  private FuncionarioRepository funcionarioRepository;

  @PostMapping
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
      String email = loginRequest.getEmail();
      String senha = loginRequest.getSenha();
      String senhaHash = CriptografiaUtils.sha256(senha);

      Optional<Funcionario> funcionarioOpt = funcionarioRepository.findByEmail(email);
      if (funcionarioOpt.isPresent() && funcionarioOpt.get().getSenha().equals(senhaHash)) {
          String jwt = JwtUtils.generateToken(funcionarioOpt.get().getId(), TipoUsuario.Funcionario);
          response.setHeader("Set-Cookie", String.format("jwt=%s; Path=/; HttpOnly; Secure; SameSite=None", jwt));
          return ResponseEntity.ok().build();
      }

      Optional<Cliente> clienteOpt = clienteRepository.findByEmail(email);
      if (clienteOpt.isPresent() && clienteOpt.get().getSenha().equals(senhaHash)) {
          String jwt = JwtUtils.generateToken(clienteOpt.get().getId(), TipoUsuario.Cliente);
          response.setHeader("Set-Cookie", String.format("jwt=%s; Path=/; HttpOnly; Secure; SameSite=None", jwt));
          return ResponseEntity.ok().build();
      }

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos");
  }

  @GetMapping("/sessao")
  public ResponseEntity<?> obterDadosDaSessao(@CookieValue(value = "jwt", required = false) String jwt) {
      if (jwt == null) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado");
      }
      try {
          Claims claims = JwtUtils.parseToken(jwt);
          Long usuarioId = claims.get("usuarioId", Long.class);
          String tipoStr = claims.get("usuarioTipo", String.class);
          TipoUsuario tipo = TipoUsuario.valueOf(tipoStr);
          return ResponseEntity.ok(new LoginResponse(usuarioId, tipo));
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sessão inválida");
      }
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletResponse response) {
      // Invalida o cookie JWT
      response.setHeader("Set-Cookie", "jwt=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0");
      return ResponseEntity.ok().build();
  }
}
