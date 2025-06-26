package br.net.backend.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
      .addMapping("/**")                     // todas as rotas que começam com /api/
      .allowedOrigins("http://localhost:4200")   // front-end Angular local
      .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
      .allowedHeaders("*")                       // todos os headers permitidos
      .allowCredentials(true);                   // se usa cookies ou Authorization
  }
}
