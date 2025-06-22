package br.net.backend.backend.rest;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.net.backend.backend.dto.EquipamentoDTO;
import br.net.backend.backend.model.Equipamento;
import br.net.backend.backend.repository.EquipamentoRepository;

@CrossOrigin
@RestController
@RequestMapping("/equipamento")
public class EquipamentoController {

    @Autowired
    private EquipamentoRepository equipamentoRepository;

    @GetMapping
    public ResponseEntity<List<EquipamentoDTO>> getAllEquipamentos() {
        List<EquipamentoDTO> equipamentos = equipamentoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(equipamentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipamentoDTO> getEquipamentoById(@PathVariable("id") Long id) {
        Optional<Equipamento> op = equipamentoRepository.findById(id);
        if (op.isPresent()) {
            return ResponseEntity.ok(toDTO(op.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<EquipamentoDTO> createEquipamento(@RequestBody EquipamentoDTO equipamentoDTO){
        Equipamento equipamento = fromDTO(equipamentoDTO);
        equipamento.setId(null); // Garante inserção
        Equipamento saved = equipamentoRepository.save(equipamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipamentoDTO> updateEquipamento(@PathVariable("id") Long id, @RequestBody EquipamentoDTO equipamentoDTO) {
        Optional<Equipamento> op = equipamentoRepository.findById(id);
        if (op.isPresent()) {
            Equipamento equipamento = fromDTO(equipamentoDTO);
            equipamento.setId(id);
            equipamentoRepository.save(equipamento);
            return ResponseEntity.ok(toDTO(equipamento));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipamento(@PathVariable("id") Long id) {
        Optional<Equipamento> op = equipamentoRepository.findById(id);
        if (op.isPresent()) {
            equipamentoRepository.delete(op.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private EquipamentoDTO toDTO(Equipamento equipamento) {
        return new EquipamentoDTO(
                equipamento.getId(),
                equipamento.getNome(),
                equipamento.getDescricao());
    }

    private Equipamento fromDTO(EquipamentoDTO equipamentoDTO) {
        return new Equipamento(
                equipamentoDTO.getId(),
                equipamentoDTO.getNome(),
                equipamentoDTO.getDescricao());
    }
}