package com.alianza.clientes.controllers;

import com.alianza.clientes.domain.Cliente;
import com.alianza.clientes.dto.AdvancedSearchRequest;
import com.alianza.clientes.dto.ClienteRequest;
import com.alianza.clientes.service.ClienteService;
import jakarta.validation.Valid;
import org.slf4j.Logger; import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

  private static final Logger log = LoggerFactory.getLogger(ClienteController.class);
  private final ClienteService service;

  public ClienteController(ClienteService service) { this.service = service; }

  @GetMapping
  public List<Cliente> list() {
    log.debug("GET /api/clientes");
    return service.findAll();
  }

  @GetMapping("/search")
  public List<Cliente> search(@RequestParam String sharedKey) {
    log.debug("GET /api/clientes/search sharedKey={}", sharedKey);
    return service.searchBySharedKey(sharedKey);
  }

  @PostMapping
  public ResponseEntity<Cliente> create(@Valid @RequestBody ClienteRequest req) {
    log.debug("POST /api/clientes body={}", req);
    Cliente created = service.create(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
    return ResponseEntity.badRequest().body(ex.getMessage());
  }
  
  @PostMapping("/advanced-search")
  public List<Cliente> advancedSearch(@RequestBody AdvancedSearchRequest req) {
    log.debug("POST /api/clientes/advanced-search");
    return service.searchAdvanced(req);
  }
  
  
  @GetMapping(value = "/export", produces = "text/csv")
  public ResponseEntity<String> exportCsv() {
    log.debug("GET /api/clientes/export");
    String csv = service.exportCsv();
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=clientes.csv")
        .body(csv);
  }
}
