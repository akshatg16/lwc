import { LightningElement, track, wire } from 'lwc';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchOpportunity from '@salesforce/apex/OpportunitiesController.fetchOpportunity';
import OPPORTUNITY_OBJ from '@salesforce/schema/Opportunity';
import OPP_STAGENAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import { refreshApex } from '@salesforce/apex';

export default class UiOpportunityFilter extends LightningElement {

    oppRecordTypeId;
    @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJ })
    opportunityInfo({ data, error }) {
        if (data) {
            this.oppRecordTypeId = data.defaultRecordTypeId;
            console.log('Opp Default Record Type ID:', data.defaultRecordTypeId);
        }
    }

    oppStageoptions;
    @wire(getPicklistValues, { recordTypeId: '$oppRecordTypeId', fieldApiName: OPP_STAGENAME_FIELD })
    oppStages({ data, error }) {
        if (data) {
            this.oppStageoptions = data.values;
        }
    }

    

    @track opportunities;

    accountName;
    oppStageValue;

    showModal = false;
    showError = false;
    noOfOpportunity = 0;

    handleDelete = (event) => {
        console.log('Inside handle delete in parent');
        let deleteId = event.detail.value;
        console.log(deleteId);
        deleteRecord(deleteId)
            .then(() => {
                console.log('Inside delete record .then()');
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    }))
                for (let opp of this.opportunities) {
                    if (opp.Id === deleteId) {
                        this.opportunities.splice(opp, 1);
                    }
                }
                refreshApex(this.fetchOpportunity());
            })
            
    }


    get numberOfOpportunityText() {
        return `${this.noOfOpportunity} Opportunities fetched.`;
    }

    get showNoOfOpportunity() {
        if (this.opportunities != null) {
            if (this.opportunities.length > 0) {
                this.noOfOpportunity = this.opportunities.length;
                return true;
            }
        }
        return false;
    }

    handleAccountNameChange = (event) => {
        this.showError = false;
        this.accountName = event.target.value;
    }

    handleOppStageChange = (event) => {
        this.showError = false;
        this.oppStageValue = event.target.value;
        this.handleSearch();
    }

    handleSearch = () => {
        console.log('Inside handleSearch');
        this.showError = false;
        this.opportunities = null;
       
        // this.showSpinner = true;
        console.log(this.oppStageValue);
        if (!this.oppStageValue) {
            this.oppStageValue = '';
            console.log('OppstageValue:', this.oppStageValue);
        }
        if (!this.accountName) {
            this.accountName = '';
            console.log('AccountName:', this.accountName);
        }
         
        if(this.accountName==''){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Accountis required',
                    message: 'Account name not entered',
                    variant: 'Error'
                }))
        }
        else{
        fetchOpportunity({ accountNameStr: this.accountName, oppStageName: this.oppStageValue })
            .then(response => {
                this.opportunities = response;
                // this.showSpinner = false;
                if (response.length == 0) {
                    this.showError = true;
                } else {
                    this.showError = false;
                }
                console.log(JSON.parse(JSON.stringify(response)));
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            })
    }
}

    // handleReset = () => {
    //     const accNameInput = this.template.querySelector('lightning-input[name=accountName]');
    //     const oppStageInput = this.template.querySelector('lightning-combobox[name=stage]');

    //     if (accNameInput) {
    //         accNameInput.reset();
    //     }
    //     if (oppStageInput) {
    //         oppStageInput.reset();
    //     }
    // }

    
    handleRemoveOpp = (event) => {
        console.log('Inside handle remove card');
        let deletedId = event.detail;
        console.log(deletedId);
        // for (let opp of this.opportunities) {
        //     if (opp.Id == deletedId) {
        //         this.opportunities.splice(opp, 1);
        //     }
        // }
        // return refreshApex(this.opps);
    }

}