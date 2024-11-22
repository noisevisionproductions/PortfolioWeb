package org.noisevisionproductions.portfolio;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Base64;

@EnableScheduling
@SpringBootApplication
@PropertySource("classpath:key.properties")
public class PortfolioApplication {
    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(PortfolioApplication.class);
        springApplication.setAdditionalProfiles("dev");
        springApplication.run(args);
    }
}