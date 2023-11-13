export class ContactFormModel {
    firstName;
    lastName;
    email;
    phone;
    requestedService;
    comments;

    /**
     * Represents a contact form.
     */
    constructor(form) {
        this.firstName = form.firstName;
        this.lastName = form.lastName;
        this.email = form.email;
        this.phone = form.phone;
        this.requestedService = form.requestedService;
        this.comments = form.comments;
    }
}