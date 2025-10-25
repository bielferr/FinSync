CREATE DATABASE BLYNC;

CREATE SCHEMA BLYNC;

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contas (
    id_conta SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    nome_conta VARCHAR(100) NOT NULL,
    tipo_conta VARCHAR(50) DEFAULT 'Conta Corrente', -- ex: Conta Corrente, Poupança, Cartão
    saldo_atual DECIMAL(10,2) DEFAULT 0.00,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    nome_categoria VARCHAR(100) NOT NULL,
    tipo_categoria VARCHAR(10) NOT NULL CHECK (tipo_categoria IN ('receita', 'despesa')),
    icone VARCHAR(50), -- ex: 'fa-utensils' (FontAwesome)
    cor_hex VARCHAR(7) DEFAULT '#FFFFFF' -- ex: '#FF5733'
);

CREATE TABLE transacoes (
    id_transacao SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    id_conta INT REFERENCES contas(id_conta)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    id_categoria INT REFERENCES categorias(id_categoria)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    valor DECIMAL(10,2) NOT NULL CHECK (valor > 0),
    descricao VARCHAR(255),
    data_transacao DATE NOT NULL,
    metodo_pagamento VARCHAR(50),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE metas (
    id_meta SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    nome_meta VARCHAR(150) NOT NULL,
    valor_objetivo DECIMAL(10,2) NOT NULL CHECK (valor_objetivo > 0),
    valor_atual DECIMAL(10,2) DEFAULT 0.00,
    data_inicio DATE DEFAULT CURRENT_DATE,
    data_fim DATE,
    status VARCHAR(20) DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'concluida', 'cancelada'))
);

CREATE TABLE orcamentos (
    id_orcamento SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    id_categoria INT REFERENCES categorias(id_categoria)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    mes_referencia VARCHAR(7) NOT NULL, -- formato YYYY-MM
    limite_valor DECIMAL(10,2) NOT NULL CHECK (limite_valor > 0),
    gasto_atual DECIMAL(10,2) DEFAULT 0.00
);

CREATE TABLE configuracoes (
    id_config SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    tema VARCHAR(20) DEFAULT 'claro' CHECK (tema IN ('claro', 'escuro')),
    notificacoes_email BOOLEAN DEFAULT TRUE,
    notificacoes_push BOOLEAN DEFAULT TRUE,
    moeda_padrao VARCHAR(5) DEFAULT 'BRL'
);

CREATE INDEX idx_transacoes_data ON transacoes (data_transacao);
CREATE INDEX idx_transacoes_tipo ON transacoes (tipo);
CREATE INDEX idx_transacoes_usuario ON transacoes (id_usuario);
CREATE INDEX idx_categorias_usuario ON categorias (id_usuario);
CREATE INDEX idx_contas_usuario ON contas (id_usuario);
