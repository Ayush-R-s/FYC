package com.example.admin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Endpoint CORS is handled by SecurityConfig


    @Override
    public void addResourceHandlers(
            @NonNull org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry registry) {
        // Map /assets/** directly to the React build output directory
        // Using file:// path to bypass copying issues
        String projectPath = System.getProperty("user.dir");
        String assetsPath = "file:///" + projectPath + "/src/main/addstu (3)/addstu/mypro/dist/assets/";

        registry.addResourceHandler("/assets/**")
                .addResourceLocations(assetsPath);
    }


}
