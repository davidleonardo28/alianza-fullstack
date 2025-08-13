package com.alianza.clientes.dto;

public record AdvancedSearchRequest(
    String sharedKeyContains,
    String emailContains,
    String businessIdEquals,
    String createdFrom,  
    String createdTo   
) {}
