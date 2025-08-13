# Alianza - Prueba Full Stack (Clientes)

Monorepo con **backend** (Java Spring Boot) y **frontend** (Angular).

## Estructura

- `/backend` – API REST: listar clientes, buscar por `sharedKey`, crear.
- `/frontend` – Angular app: pantallas responsive y consumo de la API.

## Requisitos cubiertos

- **Logs** en todos los pasos (Logback, con posibilidad de formato JSON para producción).
- **Pantallas responsive** en el frontend (Angular).
- **CORS habilitado** para desarrollo (`http://localhost:4200`).
- **Seed de datos** iniciales para pruebas locales.

## Servicios disponibles (Backend)

Base URL por defecto: `http://localhost:8080/api/clientes`

cd backend
mvn spring-boot:run

| Método | Endpoint                                 | Descripción                               |
| ------ | ---------------------------------------- | ----------------------------------------- |
| GET    | `/api/clientes`                          | Listar todos los clientes                 |
| GET    | `/api/clientes/search?sharedKey={clave}` | Buscar clientes por `sharedKey`           |
| POST   | `/api/clientes`                          | Crear un nuevo cliente                    |
| POST   | `/api/clientes/advanced-search`          | Búsqueda avanzada por múltiples criterios |
| GET    | `/api/clientes/export`                   | Exportar clientes en formato CSV          |

### Ejemplos de consumo

#### 1. Listar clientes

```bash
curl http://localhost:8080/api/clientes
```

#### 2. Buscar por sharedKey

```bash
curl "http://localhost:8080/api/clientes/search?sharedKey=jdoe"
```

#### 3. Crear cliente

```bash
curl -X POST http://localhost:8080/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"sharedKey":"jdoe","businessId":"900123","email":"john@doe.com","phone":"3001234567"}'
```

#### 4. Búsqueda avanzada

```bash
curl -X POST http://localhost:8080/api/clientes/advanced-search \
  -H "Content-Type: application/json" \
  -d '{"sharedKeyContains":"doe","emailContains":"@doe.com","createdFrom":"2025-01-01","createdTo":"2025-12-31"}'
```

#### 5. Exportar CSV

```bash
curl -o clientes.csv http://localhost:8080/api/clientes/export
```

#### Documentación de la API - Swagger UI disponible en:

```bash
http://localhost:8080/swagger-ui.html
```

### frontend

```bash
cd frontend
npm install
ng serve -o  # http://localhost:4200
```
