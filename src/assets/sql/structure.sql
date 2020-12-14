--
-- CSI Piemonte - EasyAppointment - appschedweb
-- DBMS name:      MySql 5.7.25
-- SQL:            creazione iniziale tabelle
-- ATTENZIONE: il presente script è eseguito solo in fase di installazione dell'appschedweb per un nuovo
-- tenant; i file SQL di modifica database sono presenti all'interno del componente appschedwebdb (https://gitlab.csi.it/prodotti/appsched/appschedwebdb),
-- utilizzato per allineare tutti i database istanziati (un database - un tenant)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `{{PREFIX}}ea_appointments` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `book_datetime` DATETIME,
    `start_datetime` DATETIME,
    `end_datetime` DATETIME,
    `notes` TEXT,
    `hash` TEXT,
    `is_unavailable` TINYINT(4) DEFAULT '0',
    `id_users_provider` INT(11),
    `id_users_customer` INT(11),
    `id_services` INT(11),
    `id_google_calendar` TEXT,
    PRIMARY KEY (`id`),
    KEY `id_users_customer` (`id_users_customer`),
    KEY `id_services` (`id_services`),
    KEY `id_users_provider` (`id_users_provider`)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8;

CREATE TABLE IF NOT EXISTS `{{PREFIX}}ea_consents` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `modified` DATETIME DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    `first_name` VARCHAR(256),
    `last_name` VARCHAR(256),
    `email` VARCHAR(512),
    `ip` VARCHAR(256),
    `type` VARCHAR(256),
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8;

CREATE TABLE `{{PREFIX}}ea_migrations` (
    `version` INT(11) NOT NULL
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8;

CREATE TABLE IF NOT EXISTS `{{PREFIX}}ea_roles` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256),
    `slug` VARCHAR(256),
    `is_admin` TINYINT(4),
    `appointments` INT(11),
    `customers` INT(11),
    `services` INT(11),
    `users` INT(11),
    `system_settings` INT(11),
    `user_settings` INT(11),
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8;


CREATE TABLE IF NOT EXISTS `{{PREFIX}}ea_secretaries_providers` (
    `id_users_secretary` INT(11) NOT NULL,
    `id_users_provider` INT(11) NOT NULL,
    PRIMARY KEY (`id_users_secretary`, `id_users_provider`),
    KEY `id_users_secretary` (`id_users_secretary`),
    KEY `id_users_provider` (`id_users_provider`)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8;


CREATE TABLE IF NOT EXISTS `{{PREFIX}}ea_services` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256),
    `duration` INT(11),
    `price` DECIMAL(10, 2),
    `currency` VARCHAR(32),
    `description` TEXT,
    `availabilities_type` VARCHAR(32) DEFAULT 'fixed',
    `attendants_number` INT(11) DEFAULT '1',
    `id_service_categories` INT(11),
    `vide_active` TINYINT(4) DEFAULT '1',
    `additional_info` TEXT,
    PRIMARY KEY (`id`),
    KEY `id_service_categories` (`id_service_categories`)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8;


CREATE TABLE IF NOT EXISTS `{{PREFIX}}ea_services_providers` (
    `id_users` INT(11) NOT NULL,
    `id_services` INT(11) NOT NULL,
    PRIMARY KEY (`id_users`, `id_services`),
    KEY `id_services` (`id_services`)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8;


CREATE TABLE IF NOT EXISTS `{{PREFIX}}ea_service_categories` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256),
    `description` TEXT,
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8;


CREATE TABLE IF NOT EXISTS `{{PREFIX}}ea_settings` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(512),
    `value` LONGTEXT,
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8;


CREATE TABLE IF NOT EXISTS `{{PREFIX}}ea_users` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(256),
    `last_name` VARCHAR(512),
    `email` VARCHAR(512),
    `mobile_number` VARCHAR(128),
    `phone_number` VARCHAR(128),
    `address` VARCHAR(256),
    `city` VARCHAR(256),
    `state` VARCHAR(128),
    `zip_code` VARCHAR(64),
    `notes` TEXT,
    `id_roles` INT(11) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `id_roles` (`id_roles`)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8;


CREATE TABLE IF NOT EXISTS `{{PREFIX}}ea_user_settings` (
    `id_users` INT(11) NOT NULL,
    `username` VARCHAR(256),
    `password` VARCHAR(512),
    `salt` VARCHAR(512),
    `working_plan` TEXT,
    `notifications` TINYINT(4) DEFAULT '0',
    `google_sync` TINYINT(4) DEFAULT '0',
    `google_token` TEXT,
    `google_calendar` VARCHAR(128),
    `sync_past_days` INT(11) DEFAULT '5',
    `sync_future_days` INT(11) DEFAULT '5',
    `calendar_view` VARCHAR(32) DEFAULT 'default',
    PRIMARY KEY (`id_users`)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8;

CREATE TABLE IF NOT EXISTS `{{PREFIX}}ea_appointments_id_extrel` (
  `id` int(11) NOT NULL COMMENT 'table key',
  `easy_appointments_id` int(11) NOT NULL COMMENT 'easy appointments id',
  `ext_appointments_id` varchar(1000) NOT NULL COMMENT 'external appointmnet id',
  `ext_system_name` varchar(100) NOT NULL COMMENT 'external system name'
) 
	ENGINE = InnoDB
    DEFAULT CHARSET = utf8;


ALTER TABLE `{{PREFIX}}ea_appointments`
    ADD CONSTRAINT `{{PREFIX}}appointments_users_customer` FOREIGN KEY (`id_users_customer`) REFERENCES `{{PREFIX}}ea_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    ADD CONSTRAINT `{{PREFIX}}appointments_services` FOREIGN KEY (`id_services`) REFERENCES `{{PREFIX}}ea_services` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    ADD CONSTRAINT `{{PREFIX}}appointments_users_provider` FOREIGN KEY (`id_users_provider`) REFERENCES `{{PREFIX}}ea_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE `{{PREFIX}}ea_secretaries_providers`
    ADD CONSTRAINT `{{PREFIX}}secretaries_users_secretary` FOREIGN KEY (`id_users_secretary`) REFERENCES `{{PREFIX}}ea_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    ADD CONSTRAINT `{{PREFIX}}secretaries_users_provider` FOREIGN KEY (`id_users_provider`) REFERENCES `{{PREFIX}}ea_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE `{{PREFIX}}ea_services`
    ADD CONSTRAINT `{{PREFIX}}services_service_categories` FOREIGN KEY (`id_service_categories`) REFERENCES `{{PREFIX}}ea_service_categories` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

ALTER TABLE `{{PREFIX}}ea_services_providers`
    ADD CONSTRAINT `{{PREFIX}}services_providers_users_provider` FOREIGN KEY (`id_users`) REFERENCES `{{PREFIX}}ea_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    ADD CONSTRAINT `{{PREFIX}}services_providers_services` FOREIGN KEY (`id_services`) REFERENCES `{{PREFIX}}ea_services` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE `{{PREFIX}}ea_users`
    ADD CONSTRAINT `{{PREFIX}}users_roles` FOREIGN KEY (`id_roles`) REFERENCES `{{PREFIX}}ea_roles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE `{{PREFIX}}ea_user_settings`
    ADD CONSTRAINT `{{PREFIX}}user_settings_users` FOREIGN KEY (`id_users`) REFERENCES `{{PREFIX}}ea_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
	
ALTER TABLE `{{PREFIX}}ea_appointments_id_extrel`
  ADD PRIMARY KEY (`id`);
  
ALTER TABLE `{{PREFIX}}ea_appointments_id_extrel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'table key', AUTO_INCREMENT=1;

