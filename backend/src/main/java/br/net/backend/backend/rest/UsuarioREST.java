package br.net.backend.backend.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import br.net.backend.backend.model.Usuario;

@CrossOrigin
@RestController
public class UsuarioREST {

    public static List<Usuario> lista = new ArrayList<>();

    @GetMapping("/usuarios")
    public List<Usuario> obterTodosUsuarios() {
        return lista;
    }

    static {
        lista.add(new Usuario(1, "Funcionário Padrão", "func@func", "1234", "FUNCIONARIO"));
        lista.add(new Usuario(2, "Cliente Padrão", "cli@cli", "1234", "CLIENTE"));
    }

    
}
