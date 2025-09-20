package com.finance.app.pfm_full_stack_backend.repository;

import com.finance.app.pfm_full_stack_backend.entity.RecurringTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, UUID>
{
    List<RecurringTransaction> findAllByStartDateLessThanEqualAndEndDateIsNull(java.time.LocalDate date);

    List<RecurringTransaction> findAllByStartDateLessThanEqualAndEndDateGreaterThanEqual(java.time.LocalDate startDate,
                                                                                         java.time.LocalDate endDate);

    List<RecurringTransaction> findAllByUserId(UUID userId);
}
