package br.net.backend.backend.utils;

import br.net.backend.backend.model.enums.TipoUsuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

public class JwtUtils {

    private static final String SECRET_STRING = "YourSuperSecretKeyMustBeAtLeast32BytesLongForHS256";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));
    private static final long EXPIRATION_TIME = 86400000;

    public static String generateToken(Long usuarioId, TipoUsuario tipoUsuario) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .claim("usuarioId", usuarioId)
                .claim("usuarioTipo", tipoUsuario.name())
                .subject(usuarioId.toString())
                .issuedAt(now)
                .expiration(expiration)
                .signWith(SECRET_KEY)
                .compact();
    }

    public static Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}