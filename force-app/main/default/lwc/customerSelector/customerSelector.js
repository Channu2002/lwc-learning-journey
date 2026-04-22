import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/CustomerController.getAccounts';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomerSelector extends NavigationMixin(LightningElement) {
    accounts;
    error;

    @wire(getAccounts)
    wiredAccounts({ data, error }) {
        if (data) {
            this.accounts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
        }
    }

    handleSelect(event) {
        const accountId = event.currentTarget.dataset.id;

        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__orderSelector'
            },
            state: {
                c__accountId: accountId
            }
        });
    }
}