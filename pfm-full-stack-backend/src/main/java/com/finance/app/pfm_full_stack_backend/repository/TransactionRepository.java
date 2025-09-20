package com.finance.app.pfm_full_stack_backend.repository;

import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
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
}