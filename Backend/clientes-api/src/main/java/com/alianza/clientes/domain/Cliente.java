package com.alianza.clientes.domain;

public record Cliente(String sharedKey, String businessId, String email, String phone, String createdAt) {
}
