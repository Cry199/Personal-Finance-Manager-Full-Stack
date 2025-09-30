package com.finance.app.pfm_full_stack_backend.service.recurring;

import com.finance.app.pfm_full_stack_backend.entity.JobExecutionLog;
import com.finance.app.pfm_full_stack_backend.entity.RecurringTransaction;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import com.finance.app.pfm_full_stack_backend.repository.JobExecutionLogRepository;
import com.finance.app.pfm_full_stack_backend.repository.RecurringTransactionRepository;
import com.finance.app.pfm_full_stack_backend.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

@Service
public class RecurringTransactionJobService
{
    private static final Logger log = LoggerFactory.getLogger(RecurringTransactionJobService.class);
    private static final String JOB_NAME = "recurring_transactions_processor";

    @Autowired
    private JobExecutionLogRepository jobExecutionLogRepository;

    @Autowired
    private RecurringTransactionRepository recurringTransactionRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void processRecurringTransactionsOnStartup()
    {
        log.info("Iniciando a verificação de transações recorrentes...");
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        // Procura por todas as regras de recorrência ativas.
        List<RecurringTransaction> activeNoEndDate = recurringTransactionRepository
                .findAllByStartDateLessThanEqualAndEndDateIsNull(today);
        List<RecurringTransaction> activeWithEndDate = recurringTransactionRepository
                .findAllByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);
        List<RecurringTransaction> allActiveRules = Stream.concat(activeNoEndDate.stream(),
                activeWithEndDate.stream()).distinct().toList();

        log.info("Encontradas {} regras de transações recorrentes ativas para processar.", allActiveRules.size());

        for (RecurringTransaction rule : allActiveRules)
        {
            createMissingTransactionsForRule(rule, today);
        }

        JobExecutionLog jobLog = jobExecutionLogRepository.findById(JOB_NAME)
                .orElseGet(() -> new JobExecutionLog(JOB_NAME, null));
        jobLog.setLastExecution(now);
        jobExecutionLogRepository.save(jobLog);
        log.info("Processamento de transações recorrentes concluído.");
    }

    private void createMissingTransactionsForRule(RecurringTransaction rule, LocalDate today)
    {
        LocalDate nextDueDate = (rule.getLastExecutionDate() != null)
                ? calculateNextDueDate(rule.getLastExecutionDate(), rule.getPeriod())
                : rule.getStartDate();

        LocalDate latestDateToUpdate = rule.getLastExecutionDate();
        boolean hasCreatedTransactions = false;

        while (!nextDueDate.isAfter(today)) {
            if (rule.getEndDate() == null || !nextDueDate.isAfter(rule.getEndDate()))
            {

                Transaction newTransaction = new Transaction(
                        null,
                        rule.getDescription(),
                        rule.getAmount(),
                        nextDueDate,
                        rule.getType(),
                        rule.getUser(),
                        rule.getCategory()
                );
                transactionRepository.save(newTransaction);
                log.info("Transação recorrente criada: '{}' na data {}", newTransaction.getDescription(), nextDueDate);

                latestDateToUpdate = nextDueDate;
                hasCreatedTransactions = true;
            }
            nextDueDate = calculateNextDueDate(nextDueDate, rule.getPeriod());
        }

        if (hasCreatedTransactions)
        {
            rule.setLastExecutionDate(latestDateToUpdate);
            recurringTransactionRepository.save(rule);
            log.info("Regra recorrente '{}' atualizada com a última data de execução: {}",
                    rule.getDescription(), latestDateToUpdate);
        }
    }

    private LocalDate calculateNextDueDate(LocalDate currentDate, RecurringTransaction.RecurrencePeriod period)
    {
        return switch (period)
        {
            case DAILY -> currentDate.plusDays(1);
            case WEEKLY -> currentDate.plusWeeks(1);
            case MONTHLY -> currentDate.plusMonths(1);
            case YEARLY -> currentDate.plusYears(1);
        };
    }
}