<?php defined('BASEPATH') OR exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 * Auth helper
 * @package     EasyAppointments
 * ---------------------------------------------------------------------------- */

const HEADER_FIELD_SHIB_NOME = 'HTTP_SHIB_IDENTITA_NOME';
const HEADER_FIELD_SHIB_COGNOME = 'HTTP_SHIB_IDENTITA_COGNOME';
const HEADER_FIELD_SHIB_CF = 'HTTP_SHIB_IDENTITA_CODICEFISCALE';
const HEADER_FIELD_SHIB_RISCONTRO = 'HTTP_SHIB_IDENTITA_RISCONTRO';
const HEADER_FIELD_SHIB_COMMUNITY = 'HTTP_SHIB_COMMUNITY';
const HEADER_FIELD_SHIB_LIVELLO = 'HTTP_SHIB_IDENTITA_LIVAUTH';

/**
 * @return bool True se esiste una sessione Shibboleth attiva, false altrimenti
 */
function isShibbolethSessionEnabled()
{
    return !empty($_SERVER[HEADER_FIELD_SHIB_CF]);
}

/**
 * Ottiene i dati dell'utente dai cookie di sessione di shibboleth.
 * @return array L'identità dell'utente loggato
 */
function getShibbolethIdentity()
{
    return array(
        'nome' => $_SERVER[HEADER_FIELD_SHIB_NOME],
        'cognome' => $_SERVER[HEADER_FIELD_SHIB_COGNOME],
        'cf' => $_SERVER[HEADER_FIELD_SHIB_CF],
        'autenticazione_valida' => $_SERVER[HEADER_FIELD_SHIB_RISCONTRO] !== 'N',
        'autenticazione_riscontro' => $_SERVER[HEADER_FIELD_SHIB_RISCONTRO],
        'autenticazione_metodo' => isset($_SERVER[HEADER_FIELD_SHIB_COMMUNITY]) ? $_SERVER[HEADER_FIELD_SHIB_COMMUNITY] : null,
        'autenticazione_livello' => isset($_SERVER[HEADER_FIELD_SHIB_LIVELLO]) ? $_SERVER[HEADER_FIELD_SHIB_LIVELLO] : null,
    );
}
