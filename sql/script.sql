CREATE DATABASE IF NOT EXISTS litag DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_general_ci;
USE litag;

CREATE TABLE perfil (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY nome_UN (nome)
);

-- Manter sincronizado com enums/perfil.ts e models/perfil.ts
INSERT INTO perfil (nome) VALUES ('Administrador'), ('Comum');

CREATE TABLE usuario (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(11) NOT NULL,
  telefone VARCHAR(11) NOT NULL,
  idperfil INT NOT NULL,
  senha VARCHAR(100) NOT NULL,
  token CHAR(32) DEFAULT NULL,
  exclusao DATETIME NULL,
  criacao DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY usuario_email_UN (email),
  KEY usuario_exclusao_IX (exclusao),
  KEY usuario_idperfil_FK_IX (idperfil),
  CONSTRAINT usuario_idperfil_FK FOREIGN KEY (idperfil) REFERENCES perfil (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

INSERT INTO usuario (email, nome, idperfil, senha, token, criacao, cpf, telefone) VALUES ('admin@litag.com.br', 'Administrador', 1, 'peTcC99vkvvLqGQL7mdhGuJZIvL2iMEqvCNvZw3475PJ:JVyo1Pg2HyDyw9aSOd3gNPT30KdEyiUYCjs7RUzSoYGN', NULL, NOW(), '11111111111', '11111111111');

CREATE TABLE contato (
  id INT NOT NULL AUTO_INCREMENT,
  idusuario INT NOT NULL,
  email VARCHAR(100) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  KEY contato_idusuario_IX (idusuario),
  CONSTRAINT contato_idusuario_FK FOREIGN KEY (idusuario) REFERENCES usuario (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE categoria (
  id INT NOT NULL,
  nome VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO categoria (id, nome) VALUES (1, 'Social'), (2, 'Financeiro'), (3, 'Administrativo'), (4, 'Confidencial'), (5, 'Familiar');

CREATE TABLE documento (
  id BIGINT NOT NULL AUTO_INCREMENT,
  idusuario INT NOT NULL,
  idcategoria INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(100) NOT NULL,
  conteudo MEDIUMTEXT NULL,
  extensao VARCHAR(45) NULL,
  PRIMARY KEY (id),
  KEY documento_idusuario_IX (idusuario),
  KEY documento_idcategoria_IX (idcategoria),
  CONSTRAINT documento_idusuario_FK FOREIGN KEY (idusuario) REFERENCES usuario (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT documento_idcategoria_FK FOREIGN KEY (idcategoria) REFERENCES categoria (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE contato_documento (
  id BIGINT NOT NULL AUTO_INCREMENT,
  idcontato INT NOT NULL,
  iddocumento BIGINT NOT NULL,
  PRIMARY KEY (id),
  KEY contato_documento_idcontato_IX (idcontato),
  KEY contato_documento_iddocumento_IX (iddocumento),
  CONSTRAINT contato_documento_idcontato_IX FOREIGN KEY (idcontato) REFERENCES contato (id) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT contato_documento_iddocumento_IX FOREIGN KEY (iddocumento) REFERENCES documento (id) ON DELETE CASCADE ON UPDATE RESTRICT
);

CREATE TABLE contato_categoria (
  id BIGINT NOT NULL AUTO_INCREMENT,
  idcontato INT NOT NULL,
  idcategoria INT NOT NULL,
  PRIMARY KEY (id),
  KEY contato_categoria_idcontato_IX (idcontato),
  KEY contato_categoria_idcategoria_IX (idcategoria),
  CONSTRAINT contato_categoria_idcontato_IX FOREIGN KEY (idcontato) REFERENCES contato (id) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT contato_categoria_idcategoria_IX FOREIGN KEY (idcategoria) REFERENCES categoria (id) ON DELETE CASCADE ON UPDATE RESTRICT
);
