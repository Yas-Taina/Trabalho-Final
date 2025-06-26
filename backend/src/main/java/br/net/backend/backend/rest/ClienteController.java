package br.net.backend.backend.rest;

import br.net.backend.backend.model.Cliente;
import br.net.backend.backend.repository.ClienteRepository;
import br.net.backend.backend.dto.ClienteDTO;
import br.net.backend.backend.utils.CriptografiaUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping
    public ResponseEntity<List<ClienteDTO>> getAllClientes() {
        List<ClienteDTO> clientes = clienteRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> getClienteById(@PathVariable("id") Long id) {
        Optional<Cliente> op = clienteRepository.findById(id);
        if (op.isPresent()) {
            return ResponseEntity.ok(toDTO(op.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<ClienteDTO> createCliente(@RequestBody ClienteDTO clienteDTO) {
        Cliente cliente = fromDTO(clienteDTO);
        cliente.setId(null); // Garante inserção
        cliente.setSenha(CriptografiaUtils.sha256(cliente.getSenha()));
        Cliente saved = clienteRepository.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> updateCliente(@PathVariable("id") Long id, @RequestBody ClienteDTO clienteDTO) {
        Optional<Cliente> op = clienteRepository.findById(id);
        if (op.isPresent()) {
            Cliente cliente = fromDTO(clienteDTO);
            cliente.setId(id);
            cliente.setSenha(CriptografiaUtils.sha256(cliente.getSenha()));
            clienteRepository.save(cliente);
            return ResponseEntity.ok(toDTO(cliente));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ClienteDTO> deleteCliente(@PathVariable("id") Long id) {
        Optional<Cliente> op = clienteRepository.findById(id);
        if (op.isPresent()) {
            clienteRepository.delete(op.get());
            return ResponseEntity.ok(toDTO(op.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private ClienteDTO toDTO(Cliente cliente) {
        return new ClienteDTO(
            cliente.getId(),
            cliente.getNome(),
            cliente.getEmail(),
            cliente.getSenha(),
            cliente.getCpf(),
            cliente.getEndereco(),
            cliente.getTelefone()
        );
    }

    private Cliente fromDTO(ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setId(dto.getId());
        cliente.setNome(dto.getNome());
        cliente.setEmail(dto.getEmail());
        cliente.setSenha(dto.getSenha());
        cliente.setCpf(dto.getCpf());
        cliente.setEndereco(dto.getEndereco());
        cliente.setTelefone(dto.getTelefone());
        return cliente;
    }
}
