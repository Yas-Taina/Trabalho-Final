package br.net.backend.backend.rest;

import br.net.backend.backend.model.Funcionario;
import br.net.backend.backend.repository.FuncionarioRepository;
import br.net.backend.backend.dto.FuncionarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @GetMapping
    public ResponseEntity<List<FuncionarioDTO>> getAllFuncionarios() {
        List<FuncionarioDTO> funcionarios = funcionarioRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(funcionarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> getFuncionarioById(@PathVariable("id") Long id) {
        Optional<Funcionario> op = funcionarioRepository.findById(id);
        if (op.isPresent()) {
            return ResponseEntity.ok(toDTO(op.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<FuncionarioDTO> createFuncionario(@RequestBody FuncionarioDTO funcionarioDTO) {
        Funcionario funcionario = fromDTO(funcionarioDTO);
        funcionario.setId(null); // Garante inserção
        Funcionario saved = funcionarioRepository.save(funcionario);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> updateFuncionario(@PathVariable("id") Long id, @RequestBody FuncionarioDTO funcionarioDTO) {
        Optional<Funcionario> op = funcionarioRepository.findById(id);
        if (op.isPresent()) {
            Funcionario funcionario = fromDTO(funcionarioDTO);
            funcionario.setId(id);
            funcionarioRepository.save(funcionario);
            return ResponseEntity.ok(toDTO(funcionario));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> deleteFuncionario(@PathVariable("id") Long id) {
        Optional<Funcionario> op = funcionarioRepository.findById(id);
        if (op.isPresent()) {
            funcionarioRepository.delete(op.get());
            return ResponseEntity.ok(toDTO(op.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private FuncionarioDTO toDTO(Funcionario funcionario) {
        return new FuncionarioDTO(
            funcionario.getId(),
            funcionario.getNome(),
            funcionario.getEmail(),
            funcionario.getSenha(),
            funcionario.getDataNasc() != null ? funcionario.getDataNasc().toString() : null
        );
    }

    private Funcionario fromDTO(FuncionarioDTO dto) {
        Funcionario funcionario = new Funcionario();
        funcionario.setId(dto.getId());
        funcionario.setNome(dto.getNome());
        funcionario.setEmail(dto.getEmail());
        funcionario.setSenha(dto.getSenha());
        funcionario.setDataNasc(dto.getDataNasc() != null ? LocalDate.parse(dto.getDataNasc()) : null);
        // O campo 'ativo' não é exposto no DTO, permanece default (true)
        return funcionario;
    }
}
