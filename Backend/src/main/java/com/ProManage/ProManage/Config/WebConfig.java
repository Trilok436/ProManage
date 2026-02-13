package com.ProManage.ProManage.Config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply to all endpoints
                .allowedOrigins(
                        "http://localhost:5173", // For local testing
                        "http://pro-manage-frontend-liard.vercel.app" // PASTE YOUR VERCEL URL HERE
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true) // Required for Clerk/Auth headers
                .maxAge(3600); // Cache the CORS response for 1 hour
    }
}
