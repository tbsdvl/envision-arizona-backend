'use strict';
import fastify from 'fastify';
import fastifyVite from '@fastify/vite';
import dotenv from 'dotenv';
import { validateEmail } from './src/services/emailValidation.js';
import { ContactFormModel } from './src/models/contactForm.js';
import { sendEmail } from './src/services/email.js';
import { renderToString } from 'react-dom/server';
import { uneval } from 'devalue'
dotenv.config();

const server = fastify();

await server.register(fastifyVite, {
    dev: process.argv.includes('--dev'),
    root: import.meta.url,
    createRenderFunction ({ createApp }) {
        return (server, req, reply) => {
            const data = {};
            const app = createApp({ data, server, req, reply }, req.url);
            const element = renderToString(app);

            return {
                element,
                hydration: `<script>window.hydration = ${uneval({ data })}</script>`
            }
        }
    }
});
await server.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: 2000
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

await server.vite.ready();
server.listen({ port: process.env.PORT, host: +process.env.HOST }, (err, address) => {
    if (err) {
        console.error(err);
        server.log.error(err);
        process.exit(1);
      }
      server.log.info(`Server is running on: ${address}`);
});