package com.alianza.clientes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ClienteRequest(
    @NotBlank String sharedKey,
    @NotBlank String businessId,
    @Email    String email,
    @NotBlank String phone
) {}
