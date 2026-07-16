package com.shubham.snaplink.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class ShortCodeGenerator {

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static final int LENGTH = 8;

    private final SecureRandom random = new SecureRandom();

    public String generateShortCode() {

        StringBuilder shortCode = new StringBuilder();

        for (int i = 0; i < LENGTH; i++) {
            shortCode.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }

        return shortCode.toString();
    }
}