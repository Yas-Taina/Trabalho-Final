package br.net.backend.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import br.net.backend.backend.model.Historico;

public interface HistoricoRepository extends JpaRepository<Historico, Long> {
}                                                 