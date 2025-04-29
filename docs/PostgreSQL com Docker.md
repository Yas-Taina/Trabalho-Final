# PostgreSQL com Docker

Este guia mostra como configurar um container PostgreSQL usando Docker Compose, conectar-se ao banco e executar scripts DML que estão no mesmo projeto.

## Pré requisitos
- Docker
- Docker Compose

---

Estrutura de Diretórios

Organize seu projeto da seguinte forma:

```
project-root/
├── data/                # Persistência dos dados do PostgreSQL
│   └── postgres/
├── scripts/             # Scripts SQL de inicialização (*.sql, *.sh)
└── docker-compose.yaml  # Definição dos serviços
```


## 1. `docker-compose.yaml`

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - ./data:/var/lib/postgresql/data
      - ./scripts:/docker-entrypoint-initdb.d
```  

> **Ajustes necessários**:
> - **`POSTGRES_PASSWORD`**: substitua `password` por uma senha forte.
> - **Volume**: altere `./data/postgres` para o diretório no seu host onde deseja armazenar dados.

---

## 2. Subir o container

No diretório raiz do seu projeto (onde está o `docker-compose.yaml`):

```bash
docker-compose up -d
```  

- **`-d`** roda o container em segundo plano.


Para parar e remover recursos:

```bash
docker-compose down
```

---

## 3. Conectar ao PostgreSQL

### 3.1 Via `psql` no container

```bash
docker exec -it postgres_local psql -U postgres -d postgres
```

### 3.2 Via pgAdmin

1. No pgAdmin, adicione um novo servidor.
2. Configure:
   - **Host**: `localhost`
   - **Porta**: `5432`
   - **Usuário**: `postgres`
   - **Senha**: a senha definida em `POSTGRES_PASSWORD`

---

