
DROP DATABASE IF EXISTS manutencao;
CREATE DATABASE manutencao;

-- CONECTE-SE AO BANCO
\c manutencao

-- ENUM DE ESTADOS
CREATE TYPE estado_enum AS ENUM (
    'Aberta', 'Orçada', 'Aprovada', 'Rejeitada',
    'Redirecionada', 'Arrumada', 'Paga', 'Finalizada'
);

-- TABELAS
CREATE TABLE pessoa (
    id_pessoa SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
);

CREATE TABLE endereco (
    id_endereco SERIAL PRIMARY KEY,
    cep VARCHAR(10),
    logradouro TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    cidade TEXT,
    estado VARCHAR(2)
);

CREATE TABLE funcionario (
    id_funcionario SERIAL PRIMARY KEY,
    id_pessoa INT UNIQUE NOT NULL REFERENCES pessoa(id_pessoa),
    data_nasc DATE NOT NULL
);

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    id_pessoa INT UNIQUE NOT NULL REFERENCES pessoa(id_pessoa),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    id_endereco INT REFERENCES endereco(id_endereco),
    telefone VARCHAR(20)
);

CREATE TABLE equipamento (
    id_equipamento SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT
);

CREATE TABLE solicitacao (
    id_solicitacao SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL REFERENCES cliente(id_cliente),
    id_func INT NOT NULL REFERENCES funcionario(id_funcionario),
    defeito TEXT NOT NULL,
    id_equipamento INT NOT NULL REFERENCES equipamento(id_equipamento),
    data_aberta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP,
    estado estado_enum NOT NULL DEFAULT 'Aberta',
    valor NUMERIC(10, 2),
    mensagem TEXT,
    servico TEXT
);

CREATE TABLE historico (
    id_historico SERIAL PRIMARY KEY,
    id_solicitacao INT NOT NULL REFERENCES solicitacao(id_solicitacao),
    estado estado_enum NOT NULL,
    data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_func INT NOT NULL REFERENCES funcionario(id_funcionario)
);
