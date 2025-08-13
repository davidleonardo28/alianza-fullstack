# Alianza - Prueba Técnica Full Stack (Clientes)

**Realizado por David Barrera Lopez**

Repo con **backend** (Java 21 Spring Boot) y **frontend** (Angular 19).

## Estructura

- `/backend` – API REST: listar clientes, buscar por `sharedKey`, crear.
- `/frontend` – Angular app: pantallas responsive y consumo de la API.

## Requisitos cubiertos

- **Logs** en todos los pasos (Logback, con posibilidad de formato JSON para producción).
- **Pantallas responsive** en el frontend (Angular).
- **CORS habilitado** para desarrollo (`http://localhost:4200`).
- **Seed de datos** iniciales para pruebas locales.

## Servicios disponibles (Backend)

# Base URL por defecto: `http://localhost:8080/api/clientes`

# Swagger UI: http://localhost:8080/swagger-ui.html


cd backend
mvn spring-boot:run

Configuración destacada

Seeds de ejemplo al iniciar (via @PostConstruct/CommandLineRunner).

Logs (Logback + encoder JSON opcional).

CORS abierto para http://localhost:4200 (Angular).

OpenAPI/Swagger ya incluido.

# EndPoints

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

```bash
Frontend – Pantallas

Clientes (listado)
Toolbar con: New, Export, Enter shared key + Search, Advanced Search.
Tabla responsive (Material) con columnas: Shared Key, Business ID, E-mail, Phone, Date Added.
Paginación Material.
Búsqueda simple: si el input está vacío y presionas Search, se recarga la lista completa. Si tiene ≥2 caracteres, llama GET /clientes/search.
Export: descarga un .csv usando GET /clientes/export.

Nuevo Cliente
Form reactivo con validaciones:
sharedKey (required, min 2)
businessId (required)
email (email)
phone (required, min 7 dígitos)
Estilos alineados con el mock: botones azul/teal y campos con outline.
Mensajes de error claros (“Email inválido”, “Solo dígitos (7–15)”, etc.).
Al guardar: POST /clientes, toast de éxito y vuelta al listado.
Al cancelar: vuelve al listado


# Búsqueda avanzada (dialogo)
-> Campos: sharedKey contains, email contains, businessId equals, created from/to (YYYY-MM-DD).
-> Normaliza fechas a YYYY-MM-DD.
-> Envía solo los filtros con valor (se omiten los vacíos).
-> Integra con POST /clientes/advanced-search.
-> Botón Cancelar cierra sin aplicar.

```

```bash
Cómo probar (rápido)

-> Levanta backend (8080) y frontend (4200).
-> Abre http://localhost:4200/clientes.
-> Verás los seeds precargados.
-> Escribe Sebas en Enter shared key → Search: se filtra “Sebastian Novoa”.
-> Clic en Advanced Search → llena solo email contains con @Alianza.com → Buscar: verás solo correos de ese dominio.
-> New → crea un cliente; verifica que aparezca en la tabla.
-> Export → descarga CSV.
```
