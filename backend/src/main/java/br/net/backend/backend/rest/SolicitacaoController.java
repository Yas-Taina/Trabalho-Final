package br.net.backend.backend.rest;

import br.net.backend.backend.dto.FuncionarioDTO;
import br.net.backend.backend.dto.SolicitacaoDTO;
import br.net.backend.backend.model.*;
import br.net.backend.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @PostMapping
    public ResponseEntity<SolicitacaoDTO> createSolicitacao(@RequestBody SolicitacaoDTO dto) {
        Optional<Cliente> cliente = clienteRepository.findById(dto.getIdcliente());
        Optional<Funcionario> func = funcionarioRepository.findById(dto.getIdempregado());
        Optional<Equipamento> equip = equipamentoRepository.findById(dto.getEquipamento());

        if (cliente.isEmpty() || func.isEmpty() || equip.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Solicitacao solicitacao = fromDTO(dto, cliente.get(), func.get(), equip.get());
        solicitacao.setId(null);
        solicitacao.setDataAberta(LocalDateTime.now());
        Solicitacao saved = solicitacaoRepository.save(solicitacao);

        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitacaoDTO> updateSolicitacao(@PathVariable Long id, @RequestBody SolicitacaoDTO dto) {
        Optional<Solicitacao> existing = solicitacaoRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Optional<Cliente> cliente = clienteRepository.findById(dto.getIdcliente());
        Optional<Funcionario> func = funcionarioRepository.findById(dto.getIdempregado());
        Optional<Equipamento> equip = equipamentoRepository.findById(dto.getEquipamento());

        if (cliente.isEmpty() || func.isEmpty() || equip.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Solicitacao solicitacao = fromDTO(dto, cliente.get(), func.get(), equip.get());
        solicitacao.setId(id);
        solicitacao.setDataAtualizacao(LocalDateTime.now());
        solicitacaoRepository.save(solicitacao);

        return ResponseEntity.ok(toDTO(solicitacao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSolicitacao(@PathVariable Long id) {
        Optional<Solicitacao> existing = solicitacaoRepository.findById(id);
        if (existing.isPresent()) {
            solicitacaoRepository.delete(existing.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private SolicitacaoDTO toDTO(Solicitacao solicitacao) {
        FuncionarioDTO funcionarioDTO = toDTO(solicitacao.getFuncionario());
        return new SolicitacaoDTO(
                solicitacao.getId(),
                solicitacao.getCliente().getId(),
                funcionarioDTO.getId(),
                solicitacao.getDataAberta() != null ? solicitacao.getDataAberta().toString() : null,
                solicitacao.getEstado(),
                solicitacao.getEquipamento().getId(),
                solicitacao.getDefeito(),
                solicitacao.getServico(),
                null, // manutencao not provided in DTO
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

    private Solicitacao fromDTO(SolicitacaoDTO dto, Cliente cliente, Funcionario funcionario, Equipamento equipamento) {
        Solicitacao s = new Solicitacao();
        s.setCliente(cliente);
        s.setFuncionario(funcionario);
        s.setEquipamento(equipamento);
        s.setDefeito(dto.getDefeito());
        s.setEstado(dto.getEstado());
        s.setMensagem(dto.getMensagem());
        s.setServico(dto.getDescricao());
        return s;
    }
}
