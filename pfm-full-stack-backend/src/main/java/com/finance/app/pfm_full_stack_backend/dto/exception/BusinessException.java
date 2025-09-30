package com.finance.app.pfm_full_stack_backend.dto.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class BusinessException extends RuntimeException
{
    public BusinessException(String message) { super(message); }
}
