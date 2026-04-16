import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';



// SENIOR PRACTICE: Import Schema Fields for compile-time checking
import NAME_FIELD from '@salesforce/schema/Account.Name';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';



const FIELDS = [
    NAME_FIELD,
    INDUSTRY_FIELD,
    REVENUE_FIELD,
    PHONE_FIELD
];

export default class AccountDetailCard extends LightningElement {

	@api recordId;

	accountData;
	errorMessage;
	isLoading = true; // Start loading immediately

	// THE WIRE SERVICE: Fetches data via Lightning Data Service
	@wire(getRecord, { recordId: '$recordId', fields: FIELDS })
	wiredAccount({ error, data }) {
		if (data) {
			this.accountData = data;
			this.errorMessage = undefined;
			this.isLoading = false;
		} else if (error) {
			this.errorMessage = this.extractErrorMessage(error);
			this.accountData = undefined;
			this.isLoading = false;
		}
	}

	// GETTERS: Keep the HTML perfectly clean by using getFieldValue
	get name() {
		return getFieldValue(this.accountData, NAME_FIELD);
	}
	get industry() {
		return getFieldValue(this.accountData, INDUSTRY_FIELD);
	}
	get revenue() {
		return getFieldValue(this.accountData, REVENUE_FIELD);
	}
	get phone() {
		return getFieldValue(this.accountData, PHONE_FIELD);
	}



	// Utility: Extract errors cleanly
	extractErrorMessage(error) {
		return error.body?.message || error.message || 'Error fetching Account data.';
	}

}