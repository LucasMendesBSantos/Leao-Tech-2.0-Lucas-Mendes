-- =============================================================================
-- SCHEMA DO SISTEMA BANCÁRIO
-- Execute no Supabase: SQL Editor → colar tudo → Run
-- ATENÇÃO: apaga todos os dados existentes e recria as tabelas do zero
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Remover tabelas existentes (ordem inversa das dependências)
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS servicos_contratados CASCADE;
DROP TABLE IF EXISTS transacoes           CASCADE;
DROP TABLE IF EXISTS contas               CASCADE;
DROP TABLE IF EXISTS clientes             CASCADE;
DROP TABLE IF EXISTS servicos             CASCADE;
DROP TABLE IF EXISTS usuarios             CASCADE;
DROP TABLE IF EXISTS biblioteca_usuarios  CASCADE;

-- -----------------------------------------------------------------------------
-- 2. Criar tabelas
-- -----------------------------------------------------------------------------

CREATE TABLE usuarios (
    id         BIGSERIAL    PRIMARY KEY,
    nome       TEXT         NOT NULL,
    cpf        TEXT         NOT NULL,
    senha      TEXT         NOT NULL,
    tipo       TEXT         NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT usuarios_cpf_unique   UNIQUE (cpf),
    CONSTRAINT usuarios_tipo_check   CHECK  (tipo IN ('cliente', 'funcionario'))
);

CREATE TABLE clientes (
    id         BIGSERIAL    PRIMARY KEY,
    nome       TEXT         NOT NULL,
    cpf        TEXT         NOT NULL,
    email      TEXT         NOT NULL,
    telefone   TEXT,
    endereco   TEXT,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT clientes_cpf_unique   UNIQUE (cpf)
);

CREATE TABLE contas (
    id         BIGSERIAL      PRIMARY KEY,
    cliente_id BIGINT         NOT NULL,
    numero     TEXT           NOT NULL,
    tipo       TEXT           NOT NULL DEFAULT 'corrente',
    saldo      NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT contas_numero_unique  UNIQUE      (numero),
    CONSTRAINT contas_cliente_fk     FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE,
    CONSTRAINT contas_tipo_check     CHECK       (tipo IN ('corrente', 'poupança'))
);

CREATE TABLE transacoes (
    id        BIGSERIAL      PRIMARY KEY,
    conta_id  BIGINT         NOT NULL,
    tipo      TEXT           NOT NULL,
    valor     NUMERIC(12, 2) NOT NULL,
    descricao TEXT,
    data      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT transacoes_conta_fk   FOREIGN KEY (conta_id) REFERENCES contas (id) ON DELETE CASCADE,
    CONSTRAINT transacoes_tipo_check CHECK       (tipo IN ('deposito', 'saque', 'transferencia'))
);

CREATE TABLE servicos (
    id         BIGSERIAL      PRIMARY KEY,
    nome       TEXT           NOT NULL,
    descricao  TEXT,
    preco      NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE servicos_contratados (
    id               BIGSERIAL   PRIMARY KEY,
    cliente_id       BIGINT      NOT NULL,
    servico_id       BIGINT      NOT NULL,
    data_contratacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT sc_cliente_fk FOREIGN KEY (cliente_id) REFERENCES clientes  (id) ON DELETE CASCADE,
    CONSTRAINT sc_servico_fk FOREIGN KEY (servico_id) REFERENCES servicos   (id) ON DELETE CASCADE
);
