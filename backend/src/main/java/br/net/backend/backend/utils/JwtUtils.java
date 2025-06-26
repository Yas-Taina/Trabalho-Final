package br.net.backend.backend.utils;

import br.net.backend.backend.model.enums.TipoUsuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import java.util.Date;

public class JwtUtils {
    private static final String SECRET_KEY = "segredoSuperSecreto123";
    private static final long EXPIRATION_TIME = 86400000; // 1 dia em ms

    public static String generateToken(Long usuarioId, TipoUsuario tipoUsuario) {
        return Jwts.builder()
                .claim("usuarioId", usuarioId)
                .claim("usuarioTipo", tipoUsuario.name())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                .compact();
    }

    public static Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY.getBytes())
                .parseClaimsJws(token)
                .getBody();
    }
}
