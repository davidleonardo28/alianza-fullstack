package com.alianza.clientes.service;

import com.alianza.clientes.domain.Cliente;
import com.alianza.clientes.dto.ClienteRequest;
import com.alianza.clientes.repository.ClienteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import java.time.LocalDate;
import java.util.function.Predicate;
import com.alianza.clientes.dto.AdvancedSearchRequest;

import jakarta.annotation.PostConstruct;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ClienteService {

	private static final Logger log = LoggerFactory.getLogger(ClienteService.class);
	private final ClienteRepository repo;

	public ClienteService(ClienteRepository repo) {
		this.repo = repo;
	}

	public List<Cliente> findAll() {
		var list = repo.findAll();
		log.info("findAll size={}", list.size());
		return list;
	}

	public List<Cliente> searchBySharedKey(String key) {
		log.info("searchBySharedKey key={}", key);
		if (key == null || key.isBlank())
			return List.of();
		return repo.findBySharedKey(key).map(List::of).orElse(List.of());
	}

	public Cliente create(ClienteRequest req) {
		log.info("create sharedKey={}", req.sharedKey());
		if (repo.existsBySharedKey(req.sharedKey())) {
			log.warn("sharedKey duplicada: {}", req.sharedKey());
			throw new IllegalArgumentException("sharedKey ya existe");
		}
		String createdAt = DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(OffsetDateTime.now());
		Cliente c = new Cliente(req.sharedKey(), req.businessId(), req.email(), req.phone(), createdAt);
		return repo.save(c);
	}

	// AdvancedSearch Service
	public List<Cliente> searchAdvanced(AdvancedSearchRequest req) {
		log.info("advancedSearch req={}", req);

		Predicate<Cliente> p = c -> true;

		if (req.sharedKeyContains() != null && !req.sharedKeyContains().isBlank()) {
			String q = req.sharedKeyContains().toLowerCase();
			p = p.and(c -> c.sharedKey() != null && c.sharedKey().toLowerCase().contains(q));
		}
		if (req.emailContains() != null && !req.emailContains().isBlank()) {
			String q = req.emailContains().toLowerCase();
			p = p.and(c -> c.email() != null && c.email().toLowerCase().contains(q));
		}
		if (req.businessIdEquals() != null && !req.businessIdEquals().isBlank()) {
			String q = req.businessIdEquals().toLowerCase();
			p = p.and(c -> c.businessId() != null && c.businessId().toLowerCase().equals(q));
		}

		LocalDate from = null, to = null;
		try {
			if (req.createdFrom() != null && !req.createdFrom().isBlank())
				from = LocalDate.parse(req.createdFrom());
			if (req.createdTo() != null && !req.createdTo().isBlank())
				to = LocalDate.parse(req.createdTo());
		} catch (Exception e) {
			log.warn("advancedSearch: fechas inválidas en request: {}", e.getMessage());
		}

		if (from != null || to != null) {
			final LocalDate fFrom = from, fTo = to;
			p = p.and(c -> {
				try {
					LocalDate d = OffsetDateTime.parse(c.createdAt()).toLocalDate();
					boolean ge = (fFrom == null) || !d.isBefore(fFrom); // >=
					boolean le = (fTo == null) || !d.isAfter(fTo); // <=
					return ge && le;
				} catch (Exception e) {
					return false;
				}
			});
		}

		var out = repo.findAll().stream().filter(p).toList();
		log.info("advancedSearch result size={}", out.size());
		return out;
	}

	// Export CSV
	public String exportCsv() {
		log.info("exportCsv");
		StringBuilder sb = new StringBuilder();
		sb.append("sharedKey,businessId,email,phone,createdAt\n");
		repo.findAll()
				.forEach(c -> sb.append(escapeCsv(c.sharedKey())).append(',').append(escapeCsv(c.businessId()))
						.append(',').append(escapeCsv(c.email())).append(',').append(escapeCsv(c.phone())).append(',')
						.append(escapeCsv(c.createdAt())).append('\n'));
		return sb.toString();
	}

	private String escapeCsv(String v) {
		if (v == null)
			return "";
		boolean needQuotes = v.contains(",") || v.contains("\"") || v.contains("\n");
		String out = v.replace("\"", "\"\"");
		return needQuotes ? "\"" + out + "\"" : out;
	}

	// User test initial
	@PostConstruct
	void seedData() {
		if (!repo.findAll().isEmpty())
			return;

		String now = DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(OffsetDateTime.now());

		repo.save(new Cliente("juan David ", "9001231", "junDa@Alianza.com", "3001234567", now));
		repo.save(new Cliente("Carolina Vasquez", "900124", "caro064@Alianza.com", "3109876543", now));
		repo.save(new Cliente("Sebastian Novoa", "900125", "sebas054@Alianza.com", "3205556677", now));
		repo.save(new Cliente("jdoe", "900123", "john@doe.com", "3001234567", now));

		log.info("Seed de clientes cargado: {}", repo.findAll().size());
	}
}
