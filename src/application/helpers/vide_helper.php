<?php defined('BASEPATH') OR exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 * VIDE helper
 * @package     EasyAppointments
 * ---------------------------------------------------------------------------- */

/**
 * @param array $virtual_desk
 * @param string $vide_appointment_id
 * @return string
 */
function videocall_operator_url($virtual_desk, $vide_appointment_id)
{
    return $virtual_desk->conference_url_operator . $vide_appointment_id;
}

/**
 * @param array $virtual_desk
 * @return string
 */
function videocall_user_url($virtual_desk)
{
    return $virtual_desk->conference_url . $virtual_desk->virtual_desk_id;
}
