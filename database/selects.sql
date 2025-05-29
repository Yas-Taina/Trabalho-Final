-- =========================
-- CONSULTAS PRINCIPAIS
-- =========================

select * from solicitacao;

-- 1. Lista detalhada de todas as solicitações
SELECT s.id_solicitacao,c.cpf AS cliente_cpf,p_cli.nome AS cliente_nome,f.id_funcionario,p_func.nome AS funcionario_nome,
e.nome AS equipamento,s.defeito,s.estado,s.data_aberta,s.valor,    s.servico
FROM solicitacao s
JOIN cliente c ON s.id_cliente = c.id_cliente
JOIN pessoa p_cli ON c.id_pessoa = p_cli.id_pessoa
JOIN funcionario f ON s.id_func = f.id_funcionario
JOIN pessoa p_func ON f.id_pessoa = p_func.id_pessoa
JOIN equipamento e ON s.id_equipamento = e.id_equipamento
ORDER BY s.id_solicitacao DESC;

-- 2. Histórico completo de mudanças de estado por solicitação
SELECT h.id_historico,h.id_solicitacao,h.estado,h.data,p.nome AS funcionario_responsavel
FROM historico h
JOIN funcionario f ON h.id_func = f.id_funcionario
JOIN pessoa p ON f.id_pessoa = p.id_pessoa
ORDER BY h.id_solicitacao desc, h.data;

-- 3. Informações dos clientes e seus endereços (se houver)
SELECT p.nome,c.cpf,c.telefone,e.cep,e.logradouro,e.numero,e.bairro,e.cidade,e.estado
FROM cliente c
JOIN pessoa p ON c.id_pessoa = p.id_pessoa
LEFT JOIN endereco e ON c.id_endereco = e.id_endereco;

-- 4. Quantidade de solicitações por estado atual
SELECT estado,COUNT(*) AS total
FROM solicitacao
GROUP BY estado;

-- 5. Quantidade de solicitações por tipo de equipamento
SELECT e.nome AS equipamento,COUNT(s.id_solicitacao) AS total_solicitacoes
FROM equipamento e
LEFT JOIN solicitacao s ON s.id_equipamento = e.id_equipamento
GROUP BY e.nome;

-- 6. Solicitações em aberto há mais de 7 dias (não finalizadas)
SELECT s.id_solicitacao,p.nome AS cliente,s.data_aberta,s.estado,CURRENT_DATE - s.data_aberta::date AS dias_em_aberto
FROM solicitacao s
JOIN cliente c ON s.id_cliente = c.id_cliente
JOIN pessoa p ON c.id_pessoa = p.id_pessoa
WHERE s.estado != 'Finalizada' AND s.data_aberta < NOW() - INTERVAL '7 days';

-- 7. Linha do tempo (histórico de estados) de uma solicitação específica
-- Substituir :id_solicitacao pelo valor desejado
SELECT 
    h.estado,
    h.data,
    p.nome AS alterado_por
FROM historico h
JOIN funcionario f ON h.id_func = f.id_funcionario
JOIN pessoa p ON f.id_pessoa = p.id_pessoa
WHERE h.id_solicitacao = :id_solicitacao
ORDER BY h.data;

-- 8. Quantidade de solicitações abertas por mês
SELECT DATE_TRUNC('month', data_aberta) AS mes,COUNT(*) AS total
FROM solicitacao
GROUP BY mes
ORDER BY mes;

-- 9. Funcionários com maior número de solicitações atribuídas
SELECT p.nome AS funcionario,COUNT(*) AS total_solicitacoes
FROM solicitacao s
JOIN funcionario f ON s.id_func = f.id_funcionario
JOIN pessoa p ON f.id_pessoa = p.id_pessoa
GROUP BY p.nome
ORDER BY total_solicitacoes DESC;

-- 10. Solicitações com estado final 'Rejeitada' ou 'Redirecionada'
SELECT s.id_solicitacao,p.nome AS cliente,s.estado
FROM solicitacao s
JOIN cliente c ON s.id_cliente = c.id_cliente
JOIN pessoa p ON c.id_pessoa = p.id_pessoa
WHERE s.estado IN ('Rejeitada', 'Redirecionada');
