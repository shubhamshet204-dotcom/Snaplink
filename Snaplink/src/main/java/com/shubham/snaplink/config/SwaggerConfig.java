package com.shubham.snaplink.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI snapLinkOpenAPI() {

        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()

                .info(new Info()

                        .title("SnapLink - Production Ready URL Shortener API")

                        .description("""
                            A production-ready URL shortening platform built using Spring Boot.
                            
                            Features
                            
                            • JWT Authentication
                            • Click Analytics
                            • Dashboard
                            • Pagination
                            • Search
                            • Sorting
                            • Soft Delete
                            • Docker
                            """)

                        .version("v1.0.0")

                        .contact(new Contact()

                                .name("Shubham Shet")
                                .email("your-email@example.com"))

                        .license(new License()

                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))

                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))

                .schemaRequirement(
                        securitySchemeName,
                        new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                )

                .externalDocs(new ExternalDocumentation()

                        .description("Project Documentation")
                        .url("https://github.com/"));
    }

}