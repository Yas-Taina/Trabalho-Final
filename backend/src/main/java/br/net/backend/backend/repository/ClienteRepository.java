package br.net.backend.backend.repository;

import br.net.backend.backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Métodos personalizados podem ser adicionados aqui
    Optional<Cliente> findByNome(String nome);
}
