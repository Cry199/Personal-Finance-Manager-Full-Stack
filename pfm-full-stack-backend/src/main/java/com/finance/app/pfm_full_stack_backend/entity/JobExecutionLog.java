package com.finance.app.pfm_full_stack_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_execution_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobExecutionLog
{
    @Id
    private String jobName;

    private LocalDateTime lastExecution;
}
