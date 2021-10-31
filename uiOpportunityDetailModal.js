import { api, LightningElement } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import OPP_NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import OPP_AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import OPP_CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import OPP_STAGENAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import OPP_ACCOUNTNAME_FIELD from '@salesforce/schema/Opportunity.AccountId';
import OPP_EXPECTED_REVENUE_FIELD from '@salesforce/schema/Opportunity.ExpectedRevenue';
import OPP_TYPE_FIELD from '@salesforce/schema/Opportunity.Type';
import OPP_PROBABILITY_FIELD from '@salesforce/schema/Opportunity.Probability';
import OPP_LEADSOURCE_FIELD from '@salesforce/schema/Opportunity.LeadSource';
import OPP_OWNER_FIELD from '@salesforce/schema/Opportunity.OwnerId';


export default class UiOpportunityDetailModal extends LightningElement {

    @api oppRecordId;
    deletedId;

    oppSelectedFields = [OPP_NAME_FIELD, OPP_STAGENAME_FIELD, OPP_LEADSOURCE_FIELD, OPP_TYPE_FIELD, OPP_AMOUNT_FIELD, OPP_EXPECTED_REVENUE_FIELD, OPP_PROBABILITY_FIELD, OPP_CLOSEDATE_FIELD, OPP_ACCOUNTNAME_FIELD, OPP_OWNER_FIELD];

    handleDeleteOpportunity = (event) => {
        this.deletedId = event.target.value;
        deleteRecord(event.target.value)
            .then( event => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted successfully',
                        variant: 'success'
                    }));
                this.dispatchEvent(new CustomEvent('closemodal'));
                
            })
    }


    handleHideModal = () => {
        this.dispatchEvent(new CustomEvent('closemodal'));
    }
}