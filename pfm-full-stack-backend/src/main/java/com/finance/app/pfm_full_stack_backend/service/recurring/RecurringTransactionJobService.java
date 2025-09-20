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


        JobExecutionLog jobLog = jobExecutionLogRepository.findById(JOB_NAME)
                .orElse(new JobExecutionLog(JOB_NAME, null));

        if (jobLog.getLastExecution() == null)
        {
            log.info("Primeira execução do job. A registar a hora atual e a terminar.");
            jobLog.setLastExecution(now);
            jobExecutionLogRepository.save(jobLog);
            return;
        }

        LocalDate lastRunDate = jobLog.getLastExecution().toLocalDate();
        LocalDate today = now.toLocalDate();

        // regras de recorrência ativas
        List<RecurringTransaction> activeNoEndDate = recurringTransactionRepository
                .findAllByStartDateLessThanEqualAndEndDateIsNull(today);
        List<RecurringTransaction> activeWithEndDate = recurringTransactionRepository
                .findAllByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);
        List<RecurringTransaction> allActiveRules = Stream.concat(activeNoEndDate.stream(),
                activeWithEndDate.stream()).distinct().toList();

        log.info("Encontradas {} regras de transações recorrentes ativas para processar.", allActiveRules.size());

        // cria as transações em falta.
        for (RecurringTransaction rule : allActiveRules)
        {
            createMissingTransactionsForRule(rule, lastRunDate, today);
        }

        // atualiza o registo do job com a data e hora da execução atual.
        jobLog.setLastExecution(now);
        jobExecutionLogRepository.save(jobLog);
        log.info("Processamento de transações recorrentes concluído.");
    }

    private void createMissingTransactionsForRule(RecurringTransaction rule, LocalDate lastRunDate, LocalDate today)
    {
        LocalDate latestExecutionDate = rule.getLastExecutionDate();
        LocalDate nextDueDate = rule.getLastExecutionDate() != null ? rule.getLastExecutionDate() : rule.getStartDate();

        while (!nextDueDate.isAfter(today))
        {
            if (!nextDueDate.isBefore(lastRunDate))
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

                latestExecutionDate = nextDueDate;
            }

            nextDueDate = calculateNextDueDate(nextDueDate, rule.getPeriod());
        }

        if (latestExecutionDate != null && !latestExecutionDate.equals(rule.getLastExecutionDate()))
        {
            rule.setLastExecutionDate(latestExecutionDate);
            recurringTransactionRepository.save(rule); // Salva a regra atualizada
            log.info("Regra recorrente '{}' atualizada com a data de execução {}", rule.getDescription(), latestExecutionDate);
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
