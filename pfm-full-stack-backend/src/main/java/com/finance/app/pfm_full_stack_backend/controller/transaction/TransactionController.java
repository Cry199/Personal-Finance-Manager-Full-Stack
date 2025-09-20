package com.finance.app.pfm_full_stack_backend.controller.transaction;

import com.finance.app.pfm_full_stack_backend.dto.transaction.CreateTransactionDTO;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import com.finance.app.pfm_full_stack_backend.service.transaction.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.bind.annotation.GetMapping;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController
{
    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody CreateTransactionDTO data)
    {
        Transaction newTransaction = transactionService.createTransaction(data);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(newTransaction.getId()).toUri();

        return ResponseEntity.created(uri).body(newTransaction);
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions()
    {
        var transactions = transactionService.getTransactionsForUser();

        return ResponseEntity.ok(transactions);
    }
}
