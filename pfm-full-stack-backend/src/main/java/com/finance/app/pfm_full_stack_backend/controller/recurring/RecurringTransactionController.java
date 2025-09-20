package com.finance.app.pfm_full_stack_backend.controller.recurring;

import com.finance.app.pfm_full_stack_backend.dto.recurring.CreateRecurringTransactionDTO;
import com.finance.app.pfm_full_stack_backend.dto.recurring.RecurringTransactionResponseDTO;
import com.finance.app.pfm_full_stack_backend.dto.recurring.UpdateRecurringTransactionDTO;
import com.finance.app.pfm_full_stack_backend.entity.RecurringTransaction;
import com.finance.app.pfm_full_stack_backend.service.recurring.RecurringTransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/recurring-transactions")
public class RecurringTransactionController
{
    @Autowired
    private RecurringTransactionService recurringTransactionService;

    @PostMapping
    public ResponseEntity<RecurringTransactionResponseDTO> createRecurringTransaction(
            @Valid @RequestBody CreateRecurringTransactionDTO data)
    {
        RecurringTransaction newRecurring = recurringTransactionService.createRecurringTransaction(data);
        RecurringTransactionResponseDTO responseDTO = new RecurringTransactionResponseDTO(newRecurring);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(newRecurring.getId()).toUri();

        return ResponseEntity.created(uri).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<RecurringTransactionResponseDTO>> getAllRecurringTransactions()
    {
        List<RecurringTransactionResponseDTO> recurringTransactions =
                recurringTransactionService.getRecurringTransactionsForUser();

        return ResponseEntity.ok(recurringTransactions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringTransactionResponseDTO> updateRecurringTransaction(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRecurringTransactionDTO data)
    {
        RecurringTransaction updatedRecurring = recurringTransactionService.updateRecurringTransaction(id, data);
        RecurringTransactionResponseDTO responseDTO = new RecurringTransactionResponseDTO(updatedRecurring);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecurringTransaction(@PathVariable UUID id)
    {
        recurringTransactionService.deleteRecurringTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
