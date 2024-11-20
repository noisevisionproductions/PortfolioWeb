package org.noisevisionproductions.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource("classpath:key.properties")
public class PortfolioApplication {
    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(PortfolioApplication.class);
        springApplication.setAdditionalProfiles("dev");
        springApplication.run(args);
    }
}