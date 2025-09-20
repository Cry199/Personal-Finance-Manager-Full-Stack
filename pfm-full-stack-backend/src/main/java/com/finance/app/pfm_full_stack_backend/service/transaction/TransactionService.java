package com.finance.app.pfm_full_stack_backend.service.transaction;

import com.finance.app.pfm_full_stack_backend.dto.transaction.CreateTransactionDTO;
import com.finance.app.pfm_full_stack_backend.dto.transaction.UpdateTransactionDTO;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import com.finance.app.pfm_full_stack_backend.entity.User;
import com.finance.app.pfm_full_stack_backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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

    public Transaction updateTransaction(UUID id, UpdateTransactionDTO data)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada"));


        if (!transaction.getUser().getId().equals(user.getId()))
        {
            throw new SecurityException("Acesso negado: você não é o dono desta transação.");
        }

        if (data.description() != null)
        {
            transaction.setDescription(data.description());
        }
        if (data.amount() != null)
        {
            transaction.setAmount(data.amount());
        }
        if (data.date() != null)
        {
            transaction.setDate(data.date());
        }
        if (data.type() != null) {
            transaction.setType(data.type());
        }

        return transactionRepository.save(transaction);
    }
}