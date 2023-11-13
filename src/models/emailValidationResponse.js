export class EmailValidationResponseModel {
    format;
    domain;
    disposable;
    dns;

    /**
     * Represents an email vaildation response.
     */
    constructor(response) {
        this.format = response.format;
        this.domain = response.domain;
        this.disposable = response.disposable;
        this.dns = response.dns;
    }
}