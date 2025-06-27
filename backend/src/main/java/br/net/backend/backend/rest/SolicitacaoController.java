package br.net.backend.backend.rest;

import br.net.backend.backend.dto.CriaSolicitacaoDTO;
import br.net.backend.backend.dto.FuncionarioDTO;
import br.net.backend.backend.dto.ManutencaoDTO;
import br.net.backend.backend.dto.OrcamentoDTO;
import br.net.backend.backend.dto.RedirecionamentoDTO;
import br.net.backend.backend.dto.RejeicaoDTO;
import br.net.backend.backend.dto.SolicitacaoDTO;
import br.net.backend.backend.model.*;
import br.net.backend.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/solicitacao")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private EquipamentoRepository equipamentoRepository;

    @Autowired
    private HistoricoRepository historicoRepository;

    @GetMapping
    public ResponseEntity<List<SolicitacaoDTO>> getAllSolicitacoes() {
        List<SolicitacaoDTO> list = solicitacaoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoDTO> getSolicitacaoById(@PathVariable Long id) {
        Optional<Solicitacao> opt = solicitacaoRepository.findById(id);
        return opt.map(solicitacao -> ResponseEntity.ok(toDTO(solicitacao)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/criar")
    public ResponseEntity<SolicitacaoDTO> criarSolicitacao(@RequestBody CriaSolicitacaoDTO dto) {
        Optional<Cliente> cliente = clienteRepository.findById(dto.getIdcliente());
        Optional<Equipamento> equip = equipamentoRepository.findById(dto.getEquipamento());

        if (cliente.isEmpty() || equip.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String estado = "Aberta";

        LocalDateTime dataAtual = LocalDateTime.now();
        String mensagem = estado + " em " + dataAtual.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setId(null);
        solicitacao.setCliente(cliente.get());
        solicitacao.setEquipamento(equip.get());
        solicitacao.setEstado(EstadoEnum.Aberta);
        // solicitacao.setDescricao(dto.getDescricao());
        solicitacao.setDefeito(dto.getDefeito());
        solicitacao.setMensagem(mensagem);
        solicitacao.setDataAberta(dataAtual);

        Solicitacao saved = solicitacaoRepository.save(solicitacao);
        registrarHistorico(solicitacao, dataAtual, mensagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }

    @PutMapping("/orcar/{id}")
    public ResponseEntity<SolicitacaoDTO> orcarSolicitacao(@PathVariable Long id, @RequestBody OrcamentoDTO dto) {
        Optional<Solicitacao> optionalSolicitacao = solicitacaoRepository.findById(id);

        if (optionalSolicitacao.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Solicitacao solicitacao = optionalSolicitacao.get();

        LocalDateTime dataAtual = LocalDateTime.now();
        solicitacao.setValor(dto.getValor());
        solicitacao.setEstado(EstadoEnum.Orçada);
        solicitacao.setDataAtualizacao(dataAtual);

        String nomeResponsavel = solicitacao.getFuncionario().getNome();
        String mensagem = "Orçada em " + dataAtual.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                + ", Responsável: " + nomeResponsavel;

        solicitacao.setMensagem(mensagem);

        solicitacaoRepository.save(solicitacao);
        registrarHistorico(solicitacao, dataAtual, mensagem);

        return ResponseEntity.ok(toDTO(solicitacao));
    }

    @PutMapping("/rejeitar/{id}")
    public ResponseEntity<SolicitacaoDTO> rejeitarSolicitacao(@PathVariable Long id, @RequestBody RejeicaoDTO dto) {
        Optional<Solicitacao> optionalSolicitacao = solicitacaoRepository.findById(id);

        if (optionalSolicitacao.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Solicitacao solicitacao = optionalSolicitacao.get();

        LocalDateTime dataAtual = LocalDateTime.now();
        solicitacao.setEstado(EstadoEnum.Rejeitada);
        solicitacao.setDataAtualizacao(dataAtual);

        String mensagem = "Rejeitada em " + dataAtual.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                + ", Motivo: " + dto.getMotivo();

        solicitacao.setMensagem(mensagem);

        solicitacaoRepository.save(solicitacao);

        return ResponseEntity.ok(toDTO(solicitacao));
    }

    @PutMapping("/resgatar/{id}")
    public ResponseEntity<SolicitacaoDTO> resgatarSolicitacao(@PathVariable Long id) {
        Optional<Solicitacao> optionalSolicitacao = solicitacaoRepository.findById(id);
        if (optionalSolicitacao.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Solicitacao solicitacao = optionalSolicitacao.get();
        if (solicitacao.getEstado() != EstadoEnum.Rejeitada) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null); // ou retornar uma mensagem mais clara via DTO
        }
        LocalDateTime dataAtual = LocalDateTime.now();
        solicitacao.setEstado(EstadoEnum.Aprovada);
        solicitacao.setDataAtualizacao(dataAtual);
        String mensagem = "Aprovada em " + dataAtual.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        solicitacao.setMensagem(mensagem);
        solicitacaoRepository.save(solicitacao);
        registrarHistorico(solicitacao, dataAtual, mensagem);
        return ResponseEntity.ok(toDTO(solicitacao));
    }

    @PutMapping("/arrumar/{id}")
    public ResponseEntity<SolicitacaoDTO> efetuarManutencao(@PathVariable Long id, @RequestBody ManutencaoDTO dto) {
        Optional<Solicitacao> optionalSolicitacao = solicitacaoRepository.findById(id);

        if (optionalSolicitacao.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Solicitacao solicitacao = optionalSolicitacao.get();

        LocalDateTime dataAtual = LocalDateTime.now();
        solicitacao.setServico(dto.getServicoRealizado());
        solicitacao.setRecomendacao(dto.getRecomendacao());
        solicitacao.setEstado(EstadoEnum.Arrumada);
        solicitacao.setDataAtualizacao(dataAtual);

        String mensagem = "Arrumada em " + dataAtual.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        solicitacao.setMensagem(mensagem);

        solicitacaoRepository.save(solicitacao);
        registrarHistorico(solicitacao, dataAtual, mensagem);

        return ResponseEntity.ok(toDTO(solicitacao));
    }

    @PutMapping("/pagar/{id}")
    public ResponseEntity<SolicitacaoDTO> pagarServico(@PathVariable Long id) {
        Optional<Solicitacao> optionalSolicitacao = solicitacaoRepository.findById(id);

        if (optionalSolicitacao.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Solicitacao solicitacao = optionalSolicitacao.get();

        LocalDateTime dataAtual = LocalDateTime.now();
        solicitacao.setEstado(EstadoEnum.Paga);
        solicitacao.setDataAtualizacao(dataAtual);

        String mensagem = "Pago em " + dataAtual.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        solicitacao.setMensagem(mensagem);

        solicitacaoRepository.save(solicitacao);
        registrarHistorico(solicitacao, dataAtual, mensagem);
        return ResponseEntity.ok(toDTO(solicitacao));
    }

    @PutMapping("/finalizar/{id}")
    public ResponseEntity<SolicitacaoDTO> finalizarSolicitacao(@PathVariable Long id) {
        Optional<Solicitacao> optionalSolicitacao = solicitacaoRepository.findById(id);

        if (optionalSolicitacao.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Solicitacao solicitacao = optionalSolicitacao.get();

        LocalDateTime dataAtual = LocalDateTime.now();
        solicitacao.setEstado(EstadoEnum.Finalizada);
        solicitacao.setDataAtualizacao(dataAtual);

        String mensagem = "Finalizada em " + dataAtual.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        solicitacao.setMensagem(mensagem);

        solicitacaoRepository.save(solicitacao);
        registrarHistorico(solicitacao, dataAtual, mensagem);
        return ResponseEntity.ok(toDTO(solicitacao));
    }

    @PutMapping("/redirecionar/{id}")
    public ResponseEntity<SolicitacaoDTO> redirecionarSolicitacao(
            @PathVariable Long id,
            @RequestBody RedirecionamentoDTO redirecionamentoDTO) {

        Optional<Solicitacao> optionalSolicitacao = solicitacaoRepository.findById(id);
        Optional<Funcionario> optionalFuncionario = funcionarioRepository
                .findById(redirecionamentoDTO.getIdempregado());

        if (optionalSolicitacao.isEmpty() || optionalFuncionario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Solicitacao solicitacao = optionalSolicitacao.get();
        Funcionario novoFuncionario = optionalFuncionario.get();

        LocalDateTime dataAtual = LocalDateTime.now();
        solicitacao.setFuncionario(novoFuncionario);
        solicitacao.setDataAtualizacao(dataAtual);

        String mensagem = "Redirecionada em " + dataAtual.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) +
                ", Responsável: " + novoFuncionario.getNome();
        solicitacao.setMensagem(mensagem);

        solicitacaoRepository.save(solicitacao);
        registrarHistorico(solicitacao, dataAtual, mensagem);
        return ResponseEntity.ok(toDTO(solicitacao));
    }

    private SolicitacaoDTO toDTO(Solicitacao solicitacao) {
        Funcionario func = solicitacao.getFuncionario();
        FuncionarioDTO funcionarioDTO = func != null ? toDTO(func) : null;
        return new SolicitacaoDTO(
                solicitacao.getId(),
                solicitacao.getCliente().getId(),
                funcionarioDTO != null ? funcionarioDTO.getId() : null,
                solicitacao.getDataAberta() != null ? solicitacao.getDataAberta().toString() : null,
                solicitacao.getEstado() != null ? solicitacao.getEstado().ordinal() : null, // Estado como número
                solicitacao.getEquipamento().getId(),
                solicitacao.getDefeito(), // Usando defeito como descricao
                solicitacao.getValor() != null ? solicitacao.getValor().doubleValue() : null,
                solicitacao.getServico(),
                solicitacao.getRecomendacao(),
                solicitacao.getMensagem()
        );
    }

    private FuncionarioDTO toDTO(Funcionario funcionario) {
        return new FuncionarioDTO(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getEmail(),
                funcionario.getSenha(),
                funcionario.getDataNasc() != null ? funcionario.getDataNasc().toString() : null);
    }

    private void registrarHistorico(Solicitacao solicitacao, LocalDateTime data, String mensagem) {
        Historico historico = new Historico();
        historico.setSolicitacao(solicitacao);
        historico.setEstado(solicitacao.getEstado());
        historico.setData(data);
        historico.setMensagem(mensagem);
        historico.setAtivo(true);
        historicoRepository.save(historico);
    }

}
