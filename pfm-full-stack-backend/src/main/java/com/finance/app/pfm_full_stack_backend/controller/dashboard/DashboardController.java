package com.finance.app.pfm_full_stack_backend.controller.dashboard;

import com.finance.app.pfm_full_stack_backend.dto.dashboard.DashboardSummaryDTO;
import com.finance.app.pfm_full_stack_backend.service.dashboard.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
