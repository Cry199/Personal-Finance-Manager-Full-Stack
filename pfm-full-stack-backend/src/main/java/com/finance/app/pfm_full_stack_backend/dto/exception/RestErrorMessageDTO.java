package com.finance.app.pfm_full_stack_backend.dto.exception;

import org.springframework.http.HttpStatus;

public record RestErrorMessageDTO(HttpStatus status, String message) { }
