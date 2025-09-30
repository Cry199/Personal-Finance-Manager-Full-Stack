package com.finance.app.pfm_full_stack_backend.repository;

import com.finance.app.pfm_full_stack_backend.dto.dashboard.ExpenseByCategoryDTO;
import com.finance.app.pfm_full_stack_backend.dto.dashboard.IncomeBySourceDTO;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID>, JpaSpecificationExecutor<Transaction>
{
    List<Transaction> findAllByUserId(UUID userId);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.type = :type
            AND t.date >= :startDate AND t.date <= :endDate
            """)
    BigDecimal sumAmountByTypeAndDateRange(
            UUID userId,
            Transaction.TransactionType type,
            LocalDate startDate,
            LocalDate endDate
    );

    Page<Transaction> findAllByUserId(UUID userId, Pageable pageable);

    @Query("""
            SELECT new com.finance.app.pfm_full_stack_backend.dto.dashboard.ExpenseByCategoryDTO(c.name, COALESCE(SUM(t.amount), 0))
            FROM Transaction t JOIN t.category c
            WHERE t.user.id = :userId
            AND t.type = 'EXPENSE'
            AND t.date >= :startDate AND t.date <= :endDate
            GROUP BY c.name
            ORDER BY SUM(t.amount) DESC
            """)
    List<ExpenseByCategoryDTO> findExpensesByCategory(
            UUID userId,
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
        SELECT 
            new map(
                SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) as income,
                SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) as expense
            )
        FROM Transaction t
        WHERE t.user.id = :userId 
        AND t.date >= :startDate AND t.date <= :endDate
    """)
    Map<String, BigDecimal> getMonthlySummary(UUID userId, LocalDate startDate, LocalDate endDate);

    long countByCategoryId(UUID categoryId);

    @Query("""
            SELECT new com.finance.app.pfm_full_stack_backend.dto.dashboard.ExpenseByCategoryDTO(c.name, COALESCE(SUM(t.amount), 0))
            FROM Transaction t JOIN t.category c
            WHERE t.user.id = :userId
            AND t.type = 'EXPENSE'
            AND t.date >= :startDate AND t.date <= :endDate
            GROUP BY c.name
            ORDER BY SUM(t.amount) DESC
            """)
    List<ExpenseByCategoryDTO> findTopExpensesByCategory(UUID userId, LocalDate startDate, LocalDate endDate, Pageable pageable);

    @Query("""
            SELECT new com.finance.app.pfm_full_stack_backend.dto.dashboard.IncomeBySourceDTO(c.name, COALESCE(SUM(t.amount), 0))
            FROM Transaction t JOIN t.category c
            WHERE t.user.id = :userId
            AND t.type = 'INCOME'
            AND t.date >= :startDate AND t.date <= :endDate
            GROUP BY c.name
            ORDER BY SUM(t.amount) DESC
            """)
    List<IncomeBySourceDTO> findTopIncomeSourcesByCategory(UUID userId, LocalDate startDate, LocalDate endDate, Pageable pageable);

    @Query("""
            SELECT
                new map(
                    FUNCTION('date_part', 'isodow', t.date) as dayOfWeek,
                    COALESCE(SUM(t.amount), 0) as total
                )
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.type = 'EXPENSE'
            AND t.date >= :startDate AND t.date <= :endDate
            GROUP BY FUNCTION('date_part', 'isodow', t.date)
            ORDER BY FUNCTION('date_part', 'isodow', t.date) ASC
            """)
    List<Map<String, Object>> findExpensesByWeekday(UUID userId, LocalDate startDate, LocalDate endDate);
}