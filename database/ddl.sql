-- DROP DATABASE IF EXISTS manutencao;

-- Criar o banco de dados manutencao
CREATE DATABASE manutencao;
-- Use o banco de dados criado
\c manutencao

-- Criar o tipo ENUM para os estados da solicitação (antes da tabela solicitacao)
CREATE TYPE estado_solicitacao AS ENUM (
    'Aberta',
    'Orcada',
    'Aprovada',
    'Rejeitada',
    'Redirecionada',
    'Arrumada',
    'Paga',
    'Finalizada'
);

-- Tabela para cliente
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY, -- PK id_cliente
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    endereco TEXT,
    senha VARCHAR(255) NOT NULL -- Armazenar HASH seguro
);

-- Tabela para funcionário
CREATE TABLE funcionario (
    id_funcionario SERIAL PRIMARY KEY, -- PK id_funcionario
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL -- Armazenar HASH seguro
);

-- Tabela para equipamento
CREATE TABLE equipamento (
    id_equipamento SERIAL PRIMARY KEY, -- PK id_equipamento
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

-- Tabela para solicitação de manutenção
CREATE TABLE solicitacao (
    id_solicitacao SERIAL PRIMARY KEY, -- PK id_solicitacao
    id_cliente INT NOT NULL,           -- FK para cliente.id_cliente
    id_funcionario_atribuido INT,      -- FK para funcionario.id_funcionario (pode ser nulo)
    id_equipamento INT NOT NULL,       -- FK para equipamento.id_equipamento
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado estado_solicitacao NOT NULL DEFAULT 'Aberta',
    defeito TEXT NOT NULL,
    descricao TEXT,
    manutencao TEXT,
    mensagem TEXT,
    historico TEXT,

    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_funcionario_atribuido) REFERENCES funcionario(id_funcionario) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_equipamento) REFERENCES equipamento(id_equipamento) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabela para orçamento
CREATE TABLE orcamento (
    id_orcamento SERIAL PRIMARY KEY,     -- PK id_orcamento
    id_solicitacao INT NOT NULL UNIQUE,  -- FK para solicitacao.id_solicitacao
    id_funcionario INT NOT NULL,         -- FK para funcionario.id_funcionario (quem criou)
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor DECIMAL(10, 2) NOT NULL,

    -- Chaves Estrangeiras atualizadas para referenciar as tabelas no singular
    FOREIGN KEY (id_solicitacao) REFERENCES solicitacao(id_solicitacao) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id_funcionario) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Índices
CREATE INDEX idx_solicitacao_id_cliente ON solicitacao(id_cliente);
CREATE INDEX idx_solicitacao_id_funcionario_atribuido ON solicitacao(id_funcionario_atribuido);
CREATE INDEX idx_solicitacao_id_equipamento ON solicitacao(id_equipamento);
CREATE INDEX idx_solicitacao_estado ON solicitacao(estado);
CREATE INDEX idx_orcamento_id_funcionario ON orcamento(id_funcionario);
CREATE INDEX idx_orcamento_id_solicitacao ON orcamento(id_solicitacao);