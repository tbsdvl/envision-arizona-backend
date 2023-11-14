'use strict';
import nodemailer from 'nodemailer';
import { RequestedServiceTypes } from '../models/requestedServiceTypes.js';
import { RequestedServiceConstants } from '../models/requestedServiceConstants.js';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SENDER,
        pass: process.env.PASS
    },
});

const getRequestedService = (requestedService) => {
    switch (+requestedService) {
        case RequestedServiceTypes.financialManagement:
            return RequestedServiceConstants.financialManagement;
        case RequestedServiceTypes.gateServices:
            return RequestedServiceConstants.gateServices;
        case RequestedServiceTypes.other:
            return RequestedServiceConstants.other;
    }
}

export const sendEmail = async (data) => {
    try {
        const info = await transporter.sendMail({
          from: process.env.SENDER, // sender address
          to: process.env.RECEIVER, // list of receivers
          subject: `Envision Arizona Inquiry: ${data.firstName} ${data.lastName}`, // Subject line
          text: `
          First Name: ${data.firstName}
          Last Name: ${data.lastName}
          Email Address: ${data.email}
          Phone Number: ${data.phone}
          Requested Service: ${getRequestedService(data.requestedService)}
          Comments:
          ${data.comments}
          `,
        });

        return info;
    } catch (err) {
        console.error(err);
    }
}