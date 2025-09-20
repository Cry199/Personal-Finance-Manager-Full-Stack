package com.finance.app.pfm_full_stack_backend.service.transaction;

import com.finance.app.pfm_full_stack_backend.dto.transaction.CreateTransactionDTO;
import com.finance.app.pfm_full_stack_backend.dto.transaction.TransactionResponseDTO;
import com.finance.app.pfm_full_stack_backend.dto.transaction.UpdateTransactionDTO;
import com.finance.app.pfm_full_stack_backend.entity.Category;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import com.finance.app.pfm_full_stack_backend.entity.User;
import com.finance.app.pfm_full_stack_backend.repository.CategoryRepository;
import com.finance.app.pfm_full_stack_backend.repository.TransactionRepository;
import com.finance.app.pfm_full_stack_backend.specification.transaction.TransactionSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransactionService
{
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Transaction createTransaction(CreateTransactionDTO data)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Category category = null;
        if (data.categoryId() != null)
        {
            category = categoryRepository.findById(data.categoryId())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

            if (!category.getUser().getId().equals(user.getId())) {
                throw new SecurityException("Acesso negado: a categoria não pertence a você.");
            }
        }

        Transaction newTransaction = new Transaction(
                null,
                data.description(),
                data.amount(),
                data.date(),
                data.type(),
                user,
                category
        );

        return transactionRepository.save(newTransaction);
    }

    public TransactionResponseDTO getTransactionById(UUID id)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada"));

        if (!transaction.getUser().getId().equals(user.getId()))
        {
            throw new SecurityException("Transação não encontrada");
        }

        return new TransactionResponseDTO(transaction);
    }

    public Page<TransactionResponseDTO> getTransactionsForUser(
            Pageable pageable,
            Integer month,
            Integer year,
            Transaction.TransactionType type,
            UUID categoryId
    )
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Specification<Transaction> spec = TransactionSpecification.getTransactionsByCriteria(
                user, month, year, type, categoryId
        );

        Page<Transaction> transactionsPage = transactionRepository.findAll(spec, pageable);

        return transactionsPage.map(TransactionResponseDTO::new);
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

    public void deleteTransaction(UUID id)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada"));

        if (!transaction.getUser().getId().equals(user.getId()))
        {
            throw new SecurityException("Transação não encontrada");
        }

        transactionRepository.delete(transaction);
    }
}