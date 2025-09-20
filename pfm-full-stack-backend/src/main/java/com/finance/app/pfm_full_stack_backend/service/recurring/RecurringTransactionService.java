package com.finance.app.pfm_full_stack_backend.service.recurring;

import com.finance.app.pfm_full_stack_backend.dto.recurring.CreateRecurringTransactionDTO;
import com.finance.app.pfm_full_stack_backend.dto.recurring.RecurringTransactionResponseDTO;
import com.finance.app.pfm_full_stack_backend.dto.recurring.UpdateRecurringTransactionDTO;
import com.finance.app.pfm_full_stack_backend.entity.Category;
import com.finance.app.pfm_full_stack_backend.entity.RecurringTransaction;
import com.finance.app.pfm_full_stack_backend.entity.User;
import com.finance.app.pfm_full_stack_backend.repository.CategoryRepository;
import com.finance.app.pfm_full_stack_backend.repository.RecurringTransactionRepository;
import com.finance.app.pfm_full_stack_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RecurringTransactionService
{
    @Autowired
    private RecurringTransactionRepository recurringTransactionRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private UserRepository userRepository;

    public RecurringTransaction createRecurringTransaction(CreateRecurringTransactionDTO data)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Category category = null;
        if (data.categoryId() != null) {
            category = categoryRepository.findById(data.categoryId())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

            // Verificação de segurança: A categoria pertence ao utilizador?
            if (!category.getUser().getId().equals(user.getId())) {
                throw new SecurityException("Acesso negado: a categoria não pertence a si.");
            }
        }

        RecurringTransaction newRecurring = new RecurringTransaction(
                null,
                data.description(),
                data.amount(),
                data.type(),
                data.startDate(),
                data.endDate(),
                data.period(),
                user,
                category,
                data.startDate().minusDays(1) // A última execução é o dia anterior ao início
        );

        return recurringTransactionRepository.save(newRecurring);
    }

    public List<RecurringTransactionResponseDTO> getRecurringTransactionsForUser()
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<RecurringTransaction> recurringTransactions = recurringTransactionRepository.findAllByUserId(user.getId());

        return recurringTransactions.stream()
                .map(RecurringTransactionResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public RecurringTransaction updateRecurringTransaction(UUID id, UpdateRecurringTransactionDTO data)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        RecurringTransaction recurring = recurringTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Regra de transação recorrente não encontrada"));


        if (!recurring.getUser().getId().equals(user.getId()))
        {
            throw new SecurityException("Acesso negado: esta regra não lhe pertence.");
        }

        if (data.description() != null)
        {
            recurring.setDescription(data.description());
        }
        if (data.amount() != null)
        {
            recurring.setAmount(data.amount());
        }
        if (data.type() != null)
        {
            recurring.setType(data.type());
        }
        if (data.startDate() != null)
        {
            recurring.setStartDate(data.startDate());
        }
        if (data.period() != null)
        {
            recurring.setPeriod(data.period());
        }
        if (data.categoryId() != null)
        {
            Category category = categoryRepository.findById(data.categoryId())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

            if (!category.getUser().getId().equals(user.getId()))
            {
                throw new SecurityException("Acesso negado: a categoria não pertence a si.");
            }

            recurring.setCategory(category);
        }

        if (data.endDate() != null) {
            recurring.setEndDate(data.endDate());
        }

        return recurringTransactionRepository.save(recurring);
    }

    public void deleteRecurringTransaction(UUID id)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        RecurringTransaction recurring = recurringTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Regra de transação recorrente não encontrada"));


        if (!recurring.getUser().getId().equals(user.getId()))
        {
            throw new SecurityException("Acesso negado: não pode apagar esta regra.");
        }

        recurringTransactionRepository.delete(recurring);
    }

}