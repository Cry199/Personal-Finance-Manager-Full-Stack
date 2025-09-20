package com.finance.app.pfm_full_stack_backend.service.transaction;

import com.finance.app.pfm_full_stack_backend.dto.transaction.CreateTransactionDTO;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import com.finance.app.pfm_full_stack_backend.entity.User;
import com.finance.app.pfm_full_stack_backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService
{
    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction createTransaction(CreateTransactionDTO data)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Transaction newTransaction = new Transaction(
                null,
                data.description(),
                data.amount(),
                data.date(),
                data.type(),
                user
        );

        return transactionRepository.save(newTransaction);
    }

    public List<Transaction> getTransactionsForUser()
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return transactionRepository.findAllByUserId(user.getId());
    }
}