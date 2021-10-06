import axios from 'axios';
import history from '../utils/history';
import { API_URL } from '../config/config';

export const newClient = ({ address, client_status, client_type, company_name, company_name_ar, contact_person_name, contact_person_pos, contact_person_phone, cr_number, vat_rno }) => {
    return dispatch => {
        axios.post(API_URL + 'clients/newclient', { address, client_status, client_type, company_name, company_name_ar, contact_person_name, contact_person_pos, contact_person_phone, cr_number, vat_rno }).then((response) => {
            alert('Success');
            // window.location.reload();
        })
            .catch((error) => {
                alert('Error occured');
                window.location.reload();
            });
    };
};