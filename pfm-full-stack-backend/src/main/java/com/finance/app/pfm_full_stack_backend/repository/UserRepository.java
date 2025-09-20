package com.finance.app.pfm_full_stack_backend.repository;

import com.finance.app.pfm_full_stack_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>
{
    UserDetails findByEmail(String email);
}
