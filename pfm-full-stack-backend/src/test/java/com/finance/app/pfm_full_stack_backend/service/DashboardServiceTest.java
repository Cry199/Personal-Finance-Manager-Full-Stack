package com.finance.app.pfm_full_stack_backend.service;

import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import com.finance.app.pfm_full_stack_backend.entity.User;
import com.finance.app.pfm_full_stack_backend.repository.TransactionRepository;
import com.finance.app.pfm_full_stack_backend.service.dashboard.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest
{
    @InjectMocks
    private DashboardService dashboardService;

    @Mock
    private TransactionRepository transactionRepository;

    private User testUser;

    @BeforeEach
    void setUp()
    {
        testUser = new User(UUID.randomUUID(), "Test User", "test@email.com", "password");
        var authentication = new UsernamePasswordAuthenticationToken(testUser, null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    void getDashboardSummaryForCurrentMonth_ShouldCalculateCorrectly()
    {
        // --- Given (Dado o cenário) ---
        // Dizemos ao nosso repository falso o que ele deve retornar quando for chamado.
        // Não estamos a aceder à base de dados real!
        when(transactionRepository.sumAmountByTypeAndDateRange(
                any(UUID.class),
                any(Transaction.TransactionType.class),
                any(LocalDate.class),
                any(LocalDate.class)))
                .thenAnswer(invocation -> {
                    Transaction.TransactionType type = invocation.getArgument(1);
                    if (type == Transaction.TransactionType.INCOME) {
                        return new BigDecimal("5000.00"); // Simula o total de receitas
                    }
                    if (type == Transaction.TransactionType.EXPENSE) {
                        return new BigDecimal("1500.50"); // Simula o total de despesas
                    }
                    return BigDecimal.ZERO;
                });

        // --- When (Quando a ação é executada) ---
        var summary = dashboardService.getDashboardSummaryForCurrentMonth();

        // --- Then (Então, verificamos o resultado) ---
        // Verificamos se os valores calculados estão corretos
        assertEquals(new BigDecimal("5000.00"), summary.totalIncome());
        assertEquals(new BigDecimal("1500.50"), summary.totalExpense());
        assertEquals(new BigDecimal("3499.50"), summary.balance());
    }
}
