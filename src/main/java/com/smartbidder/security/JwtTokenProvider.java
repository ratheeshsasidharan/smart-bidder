package com.smartbidder.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.jackson.io.JacksonSerializer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtTokenProvider {

    private static final String AUTHORITIES_KEY = "auth";
    private final Key key;
    private final JwtParser jwtParser;

    public JwtTokenProvider() {
        //Move to secret vault later
        String secret = "ZGZoc2RraGZrMzI5NDgyMyxtbmxzZGZqa2ZsZHNrQCMkQGRzZmdmc2RoZ3NrZGZqZ3NsO2prbGRmc2s7bGZkaztmc2RrbDtzZGZsZ2wkJSMkQCUkI0A0MzU0M2psaGtqbGRzOydrZjsnbGZzZHNkZmwnZHNmbGRmaHNka2hmazMyOTQ4MjMsbW5sc2RmamtmbGRza0AjJEBkc2ZnZnNkaGdza2RmamdzbDtqa2xkZnNrO2xmZGs7ZnNka2w7c2RmbGdsJCUjJEAlJCNANDM1NDNqbGhramxkczsna2Y7J2xmc2RzZGZsJ2RzZmw=";
        key = new SecretKeySpec(Base64.getDecoder().decode(secret), SignatureAlgorithm.HS256.getJcaName());
        jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
    }

    public String createToken(Authentication authentication) {
        String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));
        long now = (new Date()).getTime();
        Date validity = new Date(now + 1000 * 60 * 60* 60);
        return Jwts
                .builder()
                .setSubject(authentication.getName())
                .claim(AUTHORITIES_KEY, authorities)
                .signWith(key, SignatureAlgorithm.HS512)
                .setExpiration(validity)
                .serializeToJsonWith(new JacksonSerializer<>())
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = jwtParser.parseClaimsJws(token).getBody();
        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                .filter(auth -> !auth.trim().isEmpty())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        User principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    public boolean validateToken(String authToken) {
        try {
            jwtParser.parseClaimsJws(authToken);
            return true;
        } catch (Exception e) {
            log.error("Token validation error {}", e.getMessage());
        }
        return false;
    }

}
