package com.finance.app.pfm_full_stack_backend.specification.transaction;

import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import com.finance.app.pfm_full_stack_backend.entity.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TransactionSpecification
{
    public static Specification<Transaction> getTransactionsByCriteria(
            User user,
            Integer month,
            Integer year,
            Transaction.TransactionType type,
            UUID categoryId
    )
    {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("user"), user));

            if (year != null)
            {
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.function("date_part", Integer.class, criteriaBuilder.literal("year"), root.get("date")),
                        year
                ));
            }
            if (month != null)
            {
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.function("date_part", Integer.class, criteriaBuilder.literal("month"), root.get("date")),
                        month
                ));
            }

            if (type != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }
            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            query.orderBy(criteriaBuilder.desc(root.get("date")));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
