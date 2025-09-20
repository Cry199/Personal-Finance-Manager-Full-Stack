package com.finance.app.pfm_full_stack_backend.repository;

import com.finance.app.pfm_full_stack_backend.entity.JobExecutionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobExecutionLogRepository extends JpaRepository<JobExecutionLog, String> { }