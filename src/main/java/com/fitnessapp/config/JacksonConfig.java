package com.fitnessapp.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate5.jakarta.Hibernate5JakartaModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        // Register JavaTime module for LocalDateTime support
        mapper.registerModule(new JavaTimeModule());

        // Register Hibernate5 module to handle lazy loading proxies
        Hibernate5JakartaModule hibernateModule = new Hibernate5JakartaModule();
        hibernateModule.configure(Hibernate5JakartaModule.Feature.FORCE_LAZY_LOADING, false);
        hibernateModule.configure(Hibernate5JakartaModule.Feature.USE_TRANSIENT_ANNOTATION, false);

        mapper.registerModule(hibernateModule);

        // Disable writing dates as timestamps (use ISO format instead)
        mapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        return mapper;
    }
}