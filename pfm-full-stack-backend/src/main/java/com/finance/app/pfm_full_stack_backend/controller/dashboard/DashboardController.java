package com.finance.app.pfm_full_stack_backend.controller.dashboard;

import com.finance.app.pfm_full_stack_backend.dto.dashboard.DashboardSummaryDTO;
import com.finance.app.pfm_full_stack_backend.dto.dashboard.ExpenseByCategoryDTO;
import com.finance.app.pfm_full_stack_backend.dto.dashboard.MonthlySummaryDTO;
import com.finance.app.pfm_full_stack_backend.service.dashboard.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController
{
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary()
    {
        DashboardSummaryDTO summary = dashboardService.getDashboardSummaryForCurrentMonth();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/expenses-by-category")
    public ResponseEntity<List<ExpenseByCategoryDTO>> getExpensesByCategory()
    {
        List<ExpenseByCategoryDTO> data = dashboardService.getExpensesByCategoryForCurrentMonth();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<List<MonthlySummaryDTO>> getMonthlySummary()
    {
        List<MonthlySummaryDTO> summary = dashboardService.getMonthlySummaryForLast6Months();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/income-vs-expense")
    public ResponseEntity<List<MonthlySummaryDTO>> getIncomeVsExpenseSummary()
    {
        List<MonthlySummaryDTO> summary = dashboardService.getIncomeVsExpenseForLast12Months();
        return ResponseEntity.ok(summary);
    }
}
