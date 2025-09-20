package com.finance.app.pfm_full_stack_backend.controller.transaction;

import com.finance.app.pfm_full_stack_backend.dto.transaction.CreateTransactionDTO;
import com.finance.app.pfm_full_stack_backend.dto.transaction.TransactionResponseDTO;
import com.finance.app.pfm_full_stack_backend.dto.transaction.UpdateTransactionDTO;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import com.finance.app.pfm_full_stack_backend.service.transaction.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
public class TransactionController
{
    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponseDTO> createTransaction(@Valid @RequestBody CreateTransactionDTO data)
    {
        Transaction newTransaction = transactionService.createTransaction(data);
        TransactionResponseDTO responseDTO = new TransactionResponseDTO(newTransaction);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(newTransaction.getId()).toUri();

        return ResponseEntity.created(uri).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponseDTO>> getAllTransactions()
    {
        var transactions = transactionService.getTransactionsForUser();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> getTransactionById(@PathVariable UUID id)
    {
        var transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(transaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> updateTransaction(@PathVariable UUID id, @RequestBody UpdateTransactionDTO data)
    {
        Transaction updatedTransaction = transactionService.updateTransaction(id, data);

        TransactionResponseDTO responseDTO = new TransactionResponseDTO(updatedTransaction);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransaction(@PathVariable UUID id)
    {
        transactionService.deleteTransaction(id);
    }
}
