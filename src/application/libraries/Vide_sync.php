<?php defined('BASEPATH') OR exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      C.Peraudo <carlo.peraudo@consulenti.csi.it>
 * @copyright   Copyright (c) 2020, CSI Piemonte
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * ---------------------------------------------------------------------------- */

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;


/**
 * VIDE Synchronization Class
 *
 * This class implements all the core synchronization between the VIDE module
 * and the Easy!Appointments system. Do not place any model handling inside this
 * library.
 *
 * @package Libraries
 */
class Vide_Sync {

    /**
     * CodeIgniter Instance
     *
     * @var CodeIgniter
     */
    protected $CI;

    /**
     * GuzzleHttp API Client
     *
     * @var GuzzleHttp\Client
     */
    protected $client;

    /**
     * Class Constructor
     *
     * This method initializes the GuzzleHttp API Client..
     */
    public function __construct()
    {
        $this->CI =& get_instance();
        $this->client = new Client();
    }

    /**
     * @return array VIDE appointment
     * @throws GuzzleException
     */
    public function virtual_desk()
    {
        $res_vd = $this->client->get($this->CI->config->item('vide_api_base_url') . 'virtual-desk',
            $this->common_header());

        return json_decode($res_vd->getBody());
    }

    /**
     * @param string $ext_appointments_id ID appointment (VIDE)
     * @return array VIDE appointment
     * @throws GuzzleException
     */
    public function get_appointment($ext_appointments_id)
    {
        $req_params = $this->common_header();
        $req_params['headers']['Content-Type'] = 'application/json';
        $req_params['headers']['X-Auth-Role'] = 'operator';

        log_message('INFO', 'GET VIDE Appointment, ID: ' . $ext_appointments_id);
        $res_get_app = $this->client->get(
            $this->CI->config->item('vide_api_base_url') . 'appointments/' . $ext_appointments_id,
            $req_params);

        return json_decode($res_get_app->getBody());
    }

    /**
     * @param $appointment
     * @param $customer
     * @param $service
     * @param $virtual_desk_resp
     * @param $operator_first_name
     * @param $operator_last_name
     * @return string ID dell'appointment inserito in VIDE
     * @throws GuzzleException
     * @throws Exception
     */
    public function add_appointment($appointment, $customer, $service, $virtual_desk_resp,
                                    $operator_first_name, $operator_last_name)
    {
        $res_add_app = null;
        $body_add_app = null;

        $begin_date = new DateTime($appointment['start_datetime']);
        $end_date = new DateTime($appointment['end_datetime']);
        $post_params = $this->common_header();
        $post_params['json'] = [
            'appointment_id' => $appointment['id'],
            'begin_date' => $begin_date->format(DATE_ATOM),
            'end_date' => $end_date->format(DATE_ATOM),
            'status' => 'confirmed',
            'front_office_id' => $service['id'],
            'front_office_name' => $service['name'],
            'notes' => $appointment['notes'],
            'virtual_desk' => [
                'virtual_desk_id' => $virtual_desk_resp->{'virtual_desk_id'},
                'conference_id' => $virtual_desk_resp->{'conference_id'},
                'conference_url' => $virtual_desk_resp->{'conference_url'},
                'conference_url_operator' => $virtual_desk_resp->{'conference_url_operator'}
            ],
            'user' => [
                'name' => $customer['first_name'],
                'surname' => $customer['last_name'],
                'phone' => $customer['phone_number'],
                'email' => $customer['email'],
                'fiscal_code' => ''
            ],
            'operator' => [
                'operator_id' => $appointment['id_users_provider'],
                'name' => $operator_first_name,
                'surname' => $operator_last_name,
                'fiscal_code' => ''
            ]
        ];

        log_message('DEBUG', 'VIDE insert appointment $post_params:' . $post_params);
        $res_add_app = $this->client->post($this->CI->config->item('vide_api_base_url') . 'appointments',
            $post_params
        );

        $body_json_add_app = json_decode($res_add_app->getBody());

        log_message('DEBUG', 'API set appointment return code:' . $res_add_app->getStatusCode());
        log_message('DEBUG', 'VIDE appointment_id:' . $body_json_add_app->{'appointment_id'});
        return $body_json_add_app->{'appointment_id'};
    }


    /**
     * @param $appointment
     * @param $customer
     * @param $service
     * @param $body_json_app
     * @param $operator_first_name
     * @param $operator_last_name
     * @throws GuzzleException
     * @throws Exception
     */
    public function update_appointment($appointment, $customer, $service, $body_json_app,
                                       $operator_first_name, $operator_last_name)
    {
        $put_params = $this->common_header();
        $put_params['json'] = [
            'appointment_id' => $body_json_app->appointment_id,
            'begin_date' => (new DateTime($appointment['start_datetime']))->format(DATE_ATOM),
            'end_date' => (new DateTime($appointment['end_datetime']))->format(DATE_ATOM),
            'status' => 'confirmed',
            'front_office_id' => $service['id'],
            'front_office_name' => $service['name'],
            'notes' => $appointment['notes'],
            'virtual_desk' => [
                'virtual_desk_id' => $body_json_app->virtual_desk->virtual_desk_id,
                'conference_id' => $body_json_app->virtual_desk->conference_id,
                'conference_url' => $body_json_app->virtual_desk->conference_url,
                'conference_url_operator' => $body_json_app->virtual_desk->conference_url_operator
            ],
            'user' => [
                'name' => $customer['first_name'],
                'surname' => $customer['last_name'],
                'phone' => $customer['phone_number'],
                'email' => $customer['email'],
                'fiscal_code' => ''
            ],
            'operator' => [
                'operator_id' => $appointment['id_users_provider'],
                'name' => $operator_first_name,
                'surname' => $operator_last_name,
                'fiscal_code' => ''
            ]
        ];

        $this->client->put(
            $this->CI->config->item('vide_api_base_url') . 'appointments/' . $body_json_app->appointment_id,
            $put_params
        );
    }

    /**
     * @param string $ext_appointments_id ID appointment (VIDE)
     * @throws GuzzleException
     */
    public function delete_appointment($ext_appointments_id)
    {
        $body_json_app = $this->get_appointment($ext_appointments_id);

        $put_params = $this->common_header();
        $put_params['headers']['Content-Type'] = 'application/json';
        $body_json_app->{'status'} = 'deleted';
        $put_params['json'] = $body_json_app;
        log_message('INFO', 'PUT (status=deleted) VIDE Appointment, ID: ' . $ext_appointments_id);
        $this->client->put(
            $this->CI->config->item('vide_api_base_url') . 'appointments/' . $ext_appointments_id,
            $put_params
        );
    }

    /**
     * @return array
     * @throws GuzzleException
     */
    public function get_layout()
    {
        $res_get_layout = $this->client->get(
            $this->CI->config->item('vide_api_base_url') . 'layout/',
            $this->common_header());

        return json_decode($res_get_layout->getBody());
    }

    /**
     * @param $logo
     * @param $color
     * @throws GuzzleException
     */
    public function add_layout($logo, $color)
    {
        $req_params = $this->common_header();
        $req_params['json'] = ['logo' => $logo, 'color' => $color];
        $this->client->post($this->CI->config->item('vide_api_base_url') . 'layout/', $req_params);
    }

    /**
     * @param $logo
     * @param $color
     * @throws GuzzleException
     */
    public function update_layout($logo, $color)
    {
        $req_params = $this->common_header();
        $req_params['json'] = ['logo' => $logo, 'color' => $color];
        $this->client->put($this->CI->config->item('vide_api_base_url') . 'layout/', $req_params);
    }

    /**
     * @return array
     * @throws GuzzleException
     */
    public function get_carousel()
    {
        $res_get_carousel = $this->client->get(
            $this->CI->config->item('vide_api_base_url') . 'carousel/',
            $this->common_header());

        return json_decode($res_get_carousel->getBody());
    }

    /**
     * @param $carousel
     * @throws GuzzleException
     */
    public function add_carousel($carousel)
    {
        $req_params = $this->common_header();
        $counter = 1;
        foreach ($carousel as $key => $item){
            $req_params['json'][$key] = [
                'carouselId' => $key,
                'image' => 'data:'.$item["image"],
                'imageAlt' => $item["alt"] == '' ? 'immagine' . $counter : $item["alt"],
                'link' => $item["link"],
                'linkText' => $item["text"],
            ];
            $counter++;
        }
        $this->client->post($this->CI->config->item('vide_api_base_url') . 'carousel/', $req_params);
    }

    /**
     * @throws GuzzleException
     */
    public function delete_carousel()
    {
        $this->client->delete(
            $this->CI->config->item('vide_api_base_url') . 'carousel/',
            $this->common_header())
        ;
    }

    /**
     * Recupera tenant ID a partire da variabile $_SERVER['HTTP_HOST']
     * @return String tenant id
     * @throws GuzzleException
     */
    private function get_tenant_id()
    {
        $res_tn = $this->client->get($this->CI->config->item('vide_api_base_url') . 'tenant/' . $_SERVER['HTTP_HOST'], [
            'auth' => [$_ENV['VIDE_API_USER'], $_ENV['VIDE_API_PSW']],
            'headers' => [
                'x-request-id' => uniqid(),
                'x-forwarded-for' => $_SERVER['REMOTE_ADDR']
            ]
        ]);

        $body_tn = $res_tn->getBody();
        $body_json_tn = json_decode($body_tn);
        return $body_json_tn->{'tenantId'};
    }

    /**
     * @return array contenente l'header comune a tutte le invocazioni delle API (tranne quella del tenant)
     * @throws GuzzleException
     */
    private function common_header()
    {
        return [
            'auth' => [$_ENV['VIDE_API_USER'], $_ENV['VIDE_API_PSW']],
            'headers' => [
                'x-request-id' => uniqid(),
                'x-forwarded-for' => $_SERVER['REMOTE_ADDR'],
                'x-tenant-id' => $this->get_tenant_id(),
            ]
        ];
    }
}
