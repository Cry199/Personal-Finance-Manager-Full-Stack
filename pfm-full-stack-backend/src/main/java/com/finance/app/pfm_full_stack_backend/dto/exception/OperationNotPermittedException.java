package com.finance.app.pfm_full_stack_backend.dto.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class OperationNotPermittedException extends RuntimeException
{
    public OperationNotPermittedException(String message) { super(message); }
}
