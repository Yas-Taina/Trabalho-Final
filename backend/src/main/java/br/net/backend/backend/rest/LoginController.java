package br.net.backend.backend.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import br.net.backend.backend.repository.ClienteRepository;
import br.net.backend.backend.repository.FuncionarioRepository;
import br.net.backend.backend.model.Funcionario;
import br.net.backend.backend.model.Cliente;
import br.net.backend.backend.utils.CriptografiaUtils;
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
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
      String email = loginRequest.getEmail();
      String senha = loginRequest.getSenha();
      String senhaHash = CriptografiaUtils.sha256(senha);

      // Busca eficiente usando findByEmail
      Optional<Funcionario> funcionarioOpt = funcionarioRepository.findByEmail(email);
      if (funcionarioOpt.isPresent() && funcionarioOpt.get().getSenha().equals(senhaHash)) {
          return ResponseEntity.ok(new LoginResponse(funcionarioOpt.get().getId(), TipoUsuario.Funcionario));
      }

      Optional<Cliente> clienteOpt = clienteRepository.findByEmail(email);
      if (clienteOpt.isPresent() && clienteOpt.get().getSenha().equals(senhaHash)) {
          return ResponseEntity.ok(new LoginResponse(clienteOpt.get().getId(), TipoUsuario.Cliente));
      }

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos");
  }
}
