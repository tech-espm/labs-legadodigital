-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema litag
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `litag` ;

-- -----------------------------------------------------
-- Schema litag
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `litag` DEFAULT CHARACTER SET utf8 ;
USE `litag` ;

-- -----------------------------------------------------
-- Table `litag`.`Perfil`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `litag`.`Perfil` ;

CREATE TABLE IF NOT EXISTS `litag`.`Perfil` (
  `id_perfil` INT NOT NULL,
  `nome_perfil` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_perfil`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `litag`.`Usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `litag`.`Usuario` ;

CREATE TABLE IF NOT EXISTS `litag`.`Usuario` (
  `id_usuario` INT NOT NULL,
  `senha` VARCHAR(45) NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `ultima_entrada` DATETIME NOT NULL,
  `Perfil_id_perfil` INT NOT NULL,
  PRIMARY KEY (`id_usuario`),
  INDEX `fk_Usuario_Perfil1_idx` (`Perfil_id_perfil` ASC) VISIBLE,
  CONSTRAINT `fk_Usuario_Perfil1`
    FOREIGN KEY (`Perfil_id_perfil`)
    REFERENCES `litag`.`Perfil` (`id_perfil`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `litag`.`Contato`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `litag`.`Contato` ;

CREATE TABLE IF NOT EXISTS `litag`.`Contato` (
  `id_contato` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `Usuario_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_contato`),
  INDEX `fk_Contatos_Usuario1_idx` (`Usuario_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Contatos_Usuario1`
    FOREIGN KEY (`Usuario_id_usuario`)
    REFERENCES `litag`.`Usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = ujis;


-- -----------------------------------------------------
-- Table `litag`.`Categoria_Documento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `litag`.`Categoria_Documento` ;

CREATE TABLE IF NOT EXISTS `litag`.`Categoria_Documento` (
  `id_tipo_documento` INT NOT NULL,
  `desc_tipo_documento` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_tipo_documento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `litag`.`Documento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `litag`.`Documento` ;

CREATE TABLE IF NOT EXISTS `litag`.`Documento` (
  `id_documento` INT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `desc_documento` VARCHAR(45) NOT NULL,
  `Dim_Tipo_Documentos_id_tipo_documentos` INT NOT NULL,
  `Usuario_id_usuario` INT NOT NULL,
  `conteudo_documento` MEDIUMTEXT NULL,
  `extensao_documento` VARCHAR(45) NULL,
  PRIMARY KEY (`id_documento`),
  INDEX `fk_Dim_Documentos_Dim_Tipo_Documentos1_idx` (`Dim_Tipo_Documentos_id_tipo_documentos` ASC) VISIBLE,
  INDEX `fk_Documentos_Usuario1_idx` (`Usuario_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Dim_Documentos_Dim_Tipo_Documentos1`
    FOREIGN KEY (`Dim_Tipo_Documentos_id_tipo_documentos`)
    REFERENCES `litag`.`Categoria_Documento` (`id_tipo_documento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Documentos_Usuario1`
    FOREIGN KEY (`Usuario_id_usuario`)
    REFERENCES `litag`.`Usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `litag`.`Autorizados`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `litag`.`Autorizados` ;

CREATE TABLE IF NOT EXISTS `litag`.`Autorizados` (
  `id_autorizados` INT NOT NULL,
  PRIMARY KEY (`id_autorizados`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `litag`.`Documentos_has_Autorizados`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `litag`.`Documentos_has_Autorizados` ;

CREATE TABLE IF NOT EXISTS `litag`.`Documentos_has_Autorizados` (
  `Documentos_id_documentos` INT NOT NULL,
  `Documentos_Usuario_id_usuario` VARCHAR(45) NOT NULL,
  `Autorizados_id_autorizados` INT NOT NULL,
  PRIMARY KEY (`Documentos_id_documentos`, `Documentos_Usuario_id_usuario`, `Autorizados_id_autorizados`),
  INDEX `fk_Documentos_has_Autorizados_Autorizados1_idx` (`Autorizados_id_autorizados` ASC) VISIBLE,
  INDEX `fk_Documentos_has_Autorizados_Documentos1_idx` (`Documentos_id_documentos` ASC, `Documentos_Usuario_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Documentos_has_Autorizados_Documentos1`
    FOREIGN KEY (`Documentos_id_documentos`)
    REFERENCES `litag`.`Documento` (`id_documento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Documentos_has_Autorizados_Autorizados1`
    FOREIGN KEY (`Autorizados_id_autorizados`)
    REFERENCES `litag`.`Autorizados` (`id_autorizados`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `litag`.`Contato x Documento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `litag`.`Contato x Documento` ;

CREATE TABLE IF NOT EXISTS `litag`.`Contato x Documento` (
  `id_contato_documento` BIGINT NOT NULL,
  `Contato_id_contato` INT NOT NULL,
  `Documento_id_documento` INT NOT NULL,
  INDEX `fk_Contatos_has_Documentos_Documentos1_idx` (`Documento_id_documento` ASC, `id_contato_documento` ASC) VISIBLE,
  INDEX `fk_Contatos_has_Documentos_Contatos1_idx` (`Contato_id_contato` ASC) VISIBLE,
  PRIMARY KEY (`id_contato_documento`),
  CONSTRAINT `fk_Contatos_has_Documentos_Contatos1`
    FOREIGN KEY (`Contato_id_contato`)
    REFERENCES `litag`.`Contato` (`id_contato`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Contatos_has_Documentos_Documentos1`
    FOREIGN KEY (`Documento_id_documento`)
    REFERENCES `litag`.`Documento` (`id_documento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = ujis;


-- -----------------------------------------------------
-- Table `litag`.`Contato x Categoria_Documento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `litag`.`Contato x Categoria_Documento` ;

CREATE TABLE IF NOT EXISTS `litag`.`Contato x Categoria_Documento` (
  `id_contato_categoria` BIGINT NOT NULL,
  `Categoria_Documento_id_tipo_documento` INT NOT NULL,
  `Contato_id_contato` INT NOT NULL,
  INDEX `fk_Categoria_Documento_has_Contato_Contato1_idx` (`Contato_id_contato` ASC) VISIBLE,
  INDEX `fk_Categoria_Documento_has_Contato_Categoria_Documento1_idx` (`Categoria_Documento_id_tipo_documento` ASC) VISIBLE,
  PRIMARY KEY (`id_contato_categoria`),
  CONSTRAINT `fk_Categoria_Documento_has_Contato_Categoria_Documento1`
    FOREIGN KEY (`Categoria_Documento_id_tipo_documento`)
    REFERENCES `litag`.`Categoria_Documento` (`id_tipo_documento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Categoria_Documento_has_Contato_Contato1`
    FOREIGN KEY (`Contato_id_contato`)
    REFERENCES `litag`.`Contato` (`id_contato`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
