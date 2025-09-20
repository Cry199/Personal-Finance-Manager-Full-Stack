package com.finance.app.pfm_full_stack_backend.controller.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finance.app.pfm_full_stack_backend.dto.auth.RegisterDTO;
import com.finance.app.pfm_full_stack_backend.repository.CategoryRepository;
import com.finance.app.pfm_full_stack_backend.repository.TransactionRepository;
import com.finance.app.pfm_full_stack_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest
{
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void cleanUp()
    {
        transactionRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void register_ShouldReturnOk_WhenUserIsNew() throws Exception
    {
        var registerDto = new RegisterDTO("New User", "new@email.com", "password123");
        String requestBody = objectMapper.writeValueAsString(registerDto);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());
    }

    @Test
    void login_ShouldReturnToken_WhenCredentialsAreValid() throws Exception
    {
        register_ShouldReturnOk_WhenUserIsNew();

        var loginDto = new com.finance.app.pfm_full_stack_backend.dto.auth.LoginDTO("new@email.com", "password123");
        String requestBody = objectMapper.writeValueAsString(loginDto);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }
}
