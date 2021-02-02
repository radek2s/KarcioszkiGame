package com.regster.tajniacy.controller;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/pl").setViewName("redirect:/pl/index.html");
        registry.addViewController("/en-US").setViewName("redirect:/en-US/index.html");
    }
}