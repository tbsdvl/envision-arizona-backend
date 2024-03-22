'use strict';
import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { validateEmail } from './src/services/emailValidation.js';
import { ContactFormModel } from './src/models/contactForm.js';
import { sendEmail } from './src/services/email.js';
dotenv.config();

const server = fastify();
await server.register(cors, {
    // put your options here
    origin: [
        `http://${process.env.HOST}:${process.env.PORT}`,
        process.env.PROXY
    ],
    methods: ['GET', 'POST']
});
await server.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: 2000
});

server.get('/', async (request, reply) => {
    reply.code(200).send({ message: 'API is online!' });
});

server.post('/submit', async (request, reply) => {
    // validate the data with joi

    const formData = new ContactFormModel(request.body);
    const validateEmailResult = await validateEmail(formData.email);
    if (!validateEmailResult) {
        reply.code(404).send();
        return;
    }

    // send the email.
    const sendEmailResult = await sendEmail(formData);
    if (!sendEmailResult) {
        reply.code(404).send();
        return;
    }
    reply.code(200).send();
});

server.listen({ port: process.env.PORT, host: +process.env.HOST }, (err, address) => {
    if (err) {
        console.error(err);
        server.log.error(err);
        process.exit(1);
      }
      server.log.info(`Server is running on: ${address}`);
});