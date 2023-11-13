import { EmailValidationResponseModel } from '../models/emailValidationResponse.js';
import axios from 'axios';

export const validateEmail = async (email) => {
    try {
        const validateEmailResult = await axios.get(`https://www.disify.com/api/email/${email}`);

        if (validateEmailResult.status === 200) {
            const response = new EmailValidationResponseModel(validateEmailResult.data);
            return !response.disposable;
        }
    } catch (err) {
        console.error(err);
    }
}