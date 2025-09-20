package com.finance.app.pfm_full_stack_backend.controller.test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController
{
    @GetMapping
    public ResponseEntity<String> getTestData()
    {
        return ResponseEntity.ok("Se você está vendo isso, seu token é válido!");
    }
}
