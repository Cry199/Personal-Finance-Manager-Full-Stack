package com.finance.app.pfm_full_stack_backend.exception;

import com.finance.app.pfm_full_stack_backend.dto.exception.BusinessException;
import com.finance.app.pfm_full_stack_backend.dto.exception.OperationNotPermittedException;
import com.finance.app.pfm_full_stack_backend.dto.exception.ResourceNotFoundException;
import com.finance.app.pfm_full_stack_backend.dto.exception.RestErrorMessageDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    private ResponseEntity<RestErrorMessageDTO> handleResourceNotFound(ResourceNotFoundException exception) {
        RestErrorMessageDTO error = new RestErrorMessageDTO(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(OperationNotPermittedException.class)
    private ResponseEntity<RestErrorMessageDTO> handleOperationNotPermitted(OperationNotPermittedException exception) {
        RestErrorMessageDTO error = new RestErrorMessageDTO(HttpStatus.FORBIDDEN, exception.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(BusinessException.class)
    private ResponseEntity<RestErrorMessageDTO> handleBusinessException(BusinessException exception) {
        RestErrorMessageDTO error = new RestErrorMessageDTO(HttpStatus.CONFLICT, exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}
