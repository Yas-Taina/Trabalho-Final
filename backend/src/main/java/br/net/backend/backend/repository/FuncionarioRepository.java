package br.net.backend.backend.repository;

import br.net.backend.backend.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    // Métodos personalizados podem ser adicionados aqui
    Optional<Funcionario> findByNome(String nome);
    Optional<Funcionario> findByEmail(String email);
}
