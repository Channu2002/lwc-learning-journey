import { LightningElement, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getRecentAccounts from '@salesforce/apex/AccountController.getRecentAccounts';
import upsertAccount from '@salesforce/apex/AccountController.upsertAccount';

export default class AccountManager extends LightningElement {
    @track accName = '';
    @track accPhone = '';

    // Provisioned object to store the entire wire result for refreshing later
    wiredAccountResult;

    // 1. Wiring data (Declarative)
    @wire(getRecentAccounts)
    wiredAccounts(result) {
        this.wiredAccountResult = result; // Store the whole object (data + error)
    }

    // Getter for ease of use in HTML
    get accounts() {
        return this.wiredAccountResult;
    }

    handleNameChange(event) { this.accName = event.target.value; }
    handlePhoneChange(event) { this.accPhone = event.target.value; }

    // 2. The Imperative Call (The "When": On Button Click)
    async handleSave() {
        // Construct the object to match Apex parameter
        const accountToSave = {
            sobjectType: 'Account',
            Name: this.accName,
            Phone: this.accPhone
        };

        try {
            // Calling Apex Imperatively using async/await
            const accountId = await upsertAccount({ accRecord: accountToSave });

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: `Account created/updated with ID: ${accountId}`,
                    variant: 'success'
                })
            );

            // 3. The Refresh (Synchronizing the Cache)
            // We tell the wire to go get fresh data from the server
            await refreshApex(this.wiredAccountResult);

            // Reset form
            this.accName = '';
            this.accPhone = '';

        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }
}