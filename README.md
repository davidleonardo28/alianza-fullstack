# Alianza - Prueba Full Stack (Clientes)

Monorepo con **backend** (Java Spring Boot) y **frontend** (Angular).

## Estructura

- `/backend` – API REST: listar clientes, buscar por `sharedKey`, crear.
- `/frontend` – Angular app: pantallas responsive y consumo de la API.

## Requisitos cubiertos

- Logs en todos los pasos (backend con Logback, JSON opcional).
- Pruebas unitarias (JUnit 5 / Mockito en backend; Jasmine/Karma en front).
- Presentación en **Angular**; servicio en **Java**; pantallas **responsive**.
- Opcionales: **Advanced Search** y **Export CSV** (si se implementan).

## Cómo ejecutar

### Backend

```bash
cd backend
mvn spring-boot:run
# Swagger UI: http://localhost:8080/swagger-ui.html
# Health:      http://localhost:8080/actuator/health
```

```bash
cd frontend
npm install
ng serve -o  # http://localhost:4200
```

```bash
Tests
Backend: cd backend && mvn test
Frontend: cd frontend && npm test
```
