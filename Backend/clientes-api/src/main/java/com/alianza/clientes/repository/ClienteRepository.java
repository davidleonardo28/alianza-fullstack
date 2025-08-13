package com.alianza.clientes.repository;

import com.alianza.clientes.domain.Cliente;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class ClienteRepository {

	private final Map<String, Cliente> data = new ConcurrentHashMap<>();

	public List<Cliente> findAll() {
		return new ArrayList<>(data.values());
	}

	public Optional<Cliente> findBySharedKey(String key) {
		return Optional.ofNullable(data.get(key));
	}

	public boolean existsBySharedKey(String key) {
		return data.containsKey(key);
	}

	public Cliente save(Cliente c) {
		data.put(c.sharedKey(), c);
		return c;
	}

	// búsquedad parcial
	public List<Cliente> searchContains(String partial) {
		String p = partial.toLowerCase();
		return data.values().stream().filter(c -> c.sharedKey().toLowerCase().contains(p)).toList();
	}
}
