--
-- CSI Piemonte - appschedwebdb
-- DBMS name:      MySql 5.7.25
-- SQL:            popolamento tabelle 'ea_roles', 'ea_settings', 'ea_migrations'
-- ATTENZIONE: il presente script è eseguito solo in fase di installazione dell'appschedweb per un nuovo
-- tenant; i file SQL di modifica database sono presenti all'interno del componente appschedwebdb (https://gitlab.csi.it/prodotti/appsched/appschedwebdb),
-- utilizzato per allineare tutti i database istanziati (un database - un tenant)

INSERT INTO
    `{{PREFIX}}ea_roles` (`id`, `name`, `slug`, `is_admin`, `appointments`, `customers`, `services`, `users`, `system_settings`, `user_settings`)
VALUES
    (1, 'Administrator', 'admin', 1, 15, 15, 15, 15, 15, 15),
    (2, 'Provider', 'provider', 0, 15, 15, 0, 0, 0, 15),
    (3, 'Customer', 'customer', 0, 0, 0, 0, 0, 0, 0),
    (4, 'Secretary', 'secretary', 0, 15, 15, 0, 0, 0, 15);

INSERT INTO
    `{{PREFIX}}ea_settings` (`name`, `value`)
VALUES
    ('company_working_plan',
     '{"sunday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"monday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"tuesday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"wednesday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"thursday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"friday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"saturday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]}}'),
    ('book_advance_timeout', '30'),
    ('google_analytics_code', ''),
    ('customer_notifications', '1'),
    ('date_format', 'DMY'),
    ('time_format', 'regular'),
    ('require_captcha', '0'),
    ('display_cookie_notice', '0'),
    ('cookie_notice_content', 'Contenuto testo del Cookie.'),
    ('display_terms_and_conditions', '0'),
    ('terms_and_conditions_content', 'Termini e condizioni.'),
    ('display_privacy_policy', '0'),
    ('privacy_policy_content', 'Contenuto della privacy policy.');

INSERT INTO `{{PREFIX}}ea_migrations` VALUES ('12');
