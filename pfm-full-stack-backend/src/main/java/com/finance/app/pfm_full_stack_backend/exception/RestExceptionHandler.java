package com.finance.app.pfm_full_stack_backend.exception;

import com.finance.app.pfm_full_stack_backend.dto.exception.RestErrorMessageDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler
{
    @ExceptionHandler(RuntimeException.class)
    private ResponseEntity<RestErrorMessageDTO> handleRuntimeException(RuntimeException exception)
    {
        RestErrorMessageDTO error = new RestErrorMessageDTO(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(SecurityException.class)
    private ResponseEntity<RestErrorMessageDTO> handleSecurityException(SecurityException exception)
    {
        RestErrorMessageDTO error = new RestErrorMessageDTO(HttpStatus.FORBIDDEN, exception.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
}
