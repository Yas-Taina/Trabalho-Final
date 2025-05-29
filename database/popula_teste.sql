
-- FUNCIONÁRIOS
INSERT INTO pessoa (nome, email, senha) VALUES
('Funcionário 1', 'func1@empresa.com', 'senha123'),
('Funcionário 2', 'func2@empresa.com', 'senha123');

INSERT INTO funcionario (id_pessoa, data_nasc) VALUES
(1, '1990-01-01'),
(2, '1985-05-10');

-- ENDEREÇO PADRÃO
INSERT INTO endereco (cep, logradouro, numero, complemento, bairro, cidade, estado)
VALUES ('12345-678', 'Rua Exemplo', '123', '', 'Centro', 'CidadeX', 'SP');

-- 10 CLIENTES
DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..10 LOOP
        INSERT INTO pessoa (nome, email, senha)
        VALUES (format('Cliente %s', i), format('cliente%s@empresa.com', i), 'senha123');

        INSERT INTO cliente (
            id_pessoa, cpf, id_endereco, telefone
        ) VALUES (
            currval('pessoa_id_pessoa_seq'),
            format('000.000.000-%02s', i),
            1,
            format('(11)98888-99%02s', i)
        );
    END LOOP;
END $$;

-- INSERE UM EQUIPAMENTO
INSERT INTO equipamento (nome, descricao)
VALUES ('Notebook', 'Notebook com defeito na placa-mãe');

-- CRIA 10 SOLICITAÇÕES, UMA PARA CADA CLIENTE, FUNC1 PARA ÍMPAR E FUNC2 PARA PAR
DO $$
DECLARE
    estados estado_enum[] := ARRAY[
        'Aberta', 'Orçada', 'Aprovada', 'Rejeitada',
        'Redirecionada', 'Arrumada', 'Paga', 'Finalizada'
    ];
    i INT;
    id_solic INT;
    id_func INT;
BEGIN
    FOR i IN 1..10 LOOP
        -- alterna funcionário: 1 para ímpares, 2 para pares
        IF i % 2 = 1 THEN
            id_func := 1;
        ELSE
            id_func := 2;
        END IF;

        INSERT INTO solicitacao (
            id_cliente, id_func, defeito, id_equipamento, estado,
            valor, mensagem, servico
        ) VALUES (
            i, id_func, 'Defeito genérico', 1, estados[(i % array_length(estados,1)) + 1],
            100.00, 'Mensagem genérica', 'Serviço padrão'
        ) RETURNING id_solicitacao INTO id_solic;

        FOR j IN 1..((i % array_length(estados,1)) + 1) LOOP
            INSERT INTO historico (
                id_solicitacao, estado, id_func
            ) VALUES (
                id_solic, estados[j], id_func
            );
        END LOOP;
    END LOOP;
END $$;