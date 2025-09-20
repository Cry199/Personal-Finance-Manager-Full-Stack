package com.finance.app.pfm_full_stack_backend.service.dashboard;

import com.finance.app.pfm_full_stack_backend.dto.dashboard.DashboardSummaryDTO;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import com.finance.app.pfm_full_stack_backend.entity.User;
import com.finance.app.pfm_full_stack_backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

@Service
public class DashboardService
{
    @Autowired
    private TransactionRepository transactionRepository;

    public DashboardSummaryDTO getDashboardSummaryForCurrentMonth()
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endDate = today.with(TemporalAdjusters.lastDayOfMonth());

        BigDecimal totalIncome = transactionRepository.sumAmountByTypeAndDateRange(
                user.getId(),
                Transaction.TransactionType.INCOME,
                startDate,
                endDate
        );

        BigDecimal totalExpense = transactionRepository.sumAmountByTypeAndDateRange(
                user.getId(),
                Transaction.TransactionType.EXPENSE,
                startDate,
                endDate
        );

        BigDecimal balance = totalIncome.subtract(totalExpense);

        return new DashboardSummaryDTO(totalIncome, totalExpense, balance);
    }
}
