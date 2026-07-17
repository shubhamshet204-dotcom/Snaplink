package com.shubham.snaplink.exception;

import lombok.Getter;

@Getter
public class PasswordRequiredException extends RuntimeException {

    private final String shortCode;

    public PasswordRequiredException(String shortCode, String message) {
        super(message);
        this.shortCode = shortCode;
    }
}
