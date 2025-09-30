package com.finance.app.pfm_full_stack_backend.service.dashboard;

import com.finance.app.pfm_full_stack_backend.dto.dashboard.DashboardSummaryDTO;
import com.finance.app.pfm_full_stack_backend.dto.dashboard.ExpenseByCategoryDTO;
import com.finance.app.pfm_full_stack_backend.dto.dashboard.IncomeBySourceDTO;
import com.finance.app.pfm_full_stack_backend.dto.dashboard.MonthlySummaryDTO;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import com.finance.app.pfm_full_stack_backend.entity.User;
import com.finance.app.pfm_full_stack_backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Locale;
import java.util.Map;

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

    public List<ExpenseByCategoryDTO> getExpensesByCategoryForCurrentMonth()
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endDate = today.with(TemporalAdjusters.lastDayOfMonth());

        return transactionRepository.findExpensesByCategory(user.getId(), startDate, endDate);
    }

    public List<MonthlySummaryDTO> getMonthlySummaryForLast6Months()
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<MonthlySummaryDTO> summaryList = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (int i = 0; i < 6; i++) {
            LocalDate date = today.minusMonths(i);
            LocalDate startDate = date.with(TemporalAdjusters.firstDayOfMonth());
            LocalDate endDate = date.with(TemporalAdjusters.lastDayOfMonth());

            Map<String, BigDecimal> result = transactionRepository.getMonthlySummary(user.getId(), startDate, endDate);

            BigDecimal totalIncome = result.get("income") != null ? result.get("income") : BigDecimal.ZERO;
            BigDecimal totalExpense = result.get("expense") != null ? result.get("expense") : BigDecimal.ZERO;

            // Obtém o nome do mês em português
            String monthName = Month.of(date.getMonthValue()).getDisplayName(TextStyle.FULL, new Locale("pt", "BR"));

            summaryList.add(new MonthlySummaryDTO(
                    date.getYear(),
                    date.getMonthValue(),
                    monthName,
                    totalIncome,
                    totalExpense
            ));
        }

        Collections.reverse(summaryList);

        return summaryList;
    }

    public List<MonthlySummaryDTO> getIncomeVsExpenseForLast12Months()
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<MonthlySummaryDTO> summaryList = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (int i = 0; i < 12; i++)
        {
            LocalDate date = today.minusMonths(i);
            LocalDate startDate = date.with(TemporalAdjusters.firstDayOfMonth());
            LocalDate endDate = date.with(TemporalAdjusters.lastDayOfMonth());

            Map<String, BigDecimal> result = transactionRepository.getMonthlySummary(user.getId(), startDate, endDate);

            BigDecimal totalIncome = result.get("income") != null ? result.get("income") : BigDecimal.ZERO;
            BigDecimal totalExpense = result.get("expense") != null ? result.get("expense") : BigDecimal.ZERO;

            String monthName = Month.of(date.getMonthValue()).getDisplayName(TextStyle.FULL, new Locale("pt",
                    "BR"));

            summaryList.add(new MonthlySummaryDTO(
                    date.getYear(),
                    date.getMonthValue(),
                    monthName,
                    totalIncome,
                    totalExpense
            ));
        }

        Collections.reverse(summaryList);

        return summaryList;
    }

    public List<MonthlySummaryDTO> getYearlySummary(int year)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<MonthlySummaryDTO> summaryList = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            LocalDate date = LocalDate.of(year, month, 1);
            LocalDate startDate = date.with(TemporalAdjusters.firstDayOfMonth());
            LocalDate endDate = date.with(TemporalAdjusters.lastDayOfMonth());

            Map<String, BigDecimal> result = transactionRepository.getMonthlySummary(user.getId(), startDate, endDate);

            BigDecimal totalIncome = result.get("income") != null ? result.get("income") : BigDecimal.ZERO;
            BigDecimal totalExpense = result.get("expense") != null ? result.get("expense") : BigDecimal.ZERO;

            String monthName = Month.of(month).getDisplayName(TextStyle.FULL, new Locale("pt", "BR"));

            summaryList.add(new MonthlySummaryDTO(
                    year,
                    month,
                    monthName,
                    totalIncome,
                    totalExpense
            ));
        }

        return summaryList;
    }
}
