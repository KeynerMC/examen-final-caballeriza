package com.caballeriza.sistema.dto;

import com.caballeriza.sistema.model.User;
import lombok.Data;

@Data
public class RegisterRequest {
    private String nombre;
    private String email;
    private String password;
    private User.Role role;
}