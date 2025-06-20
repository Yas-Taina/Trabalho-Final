package br.net.backend.backend.repository;

import br.net.backend.backend.model.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    // Métodos personalizados podem ser adicionados aqui
    Optional<Equipamento> findByNome(String nome);
}
