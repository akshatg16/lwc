import { LightningElement, track } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityFilterController.getOpportunities';

export default class OpportunityFilter extends LightningElement {

    @track opportunities = [];
    @track originalData = [];
    @track accountName;
    showModal = false;
    @track data = {};
    stageOptions = [
        {label : 'All', value : 'All'},
        {label : 'Prospecting', value : 'Prospecting'},
        {label : 'Qualification', value : 'Qualification'},
        {label : 'Needs Analysis', value : 'Needs Analysis'},
        {label : 'Value Proposition', value : 'Value Proposition'},
        {label : 'Closed Won', value : 'Closed Won'},
        {label : 'Closed Lost', value : 'Closed Lost'}
    ];
    get columns() {
        return [
            { label: 'Opportunity Name', fieldName: 'Name' },
            { label: 'Stage', fieldName: 'StageName' },
            { label: 'Last Modified Date', fieldName: 'LastModifiedDate', type: 'date' }
        ];
    }
    // @track columns = [
    //     { label: 'Opportunity Name', fieldName: 'Name' },
    //     { label: 'Stage', fieldName: 'StageName' },
    //     { label: 'Last Modified Date', fieldName: 'LastModifiedDate', type: 'date' }
    // ];
    stageChange(event) {
        let stage = event.target.value;
        let tempData = [];
        if (stage !='All') {
            this.originalData.forEach(element=>{
                if (element.StageName == stage) {
                    tempData.push(element)
                };
            });
        } else {
            tempData = this.originalData;
        }
        this.opportunities = tempData;
    }
    handleChange(event) {
        this.accountName = event.target.value;
    }

    handleSearch() {
        console.log('columns',this.columns);
        getOpportunities({
            accountName : this.accountName
        })
        .then(result=>{
            this.originalData = result;
            this.opportunities = result;
            console.log('columns',this.opportunities);
        })
        .catch(error=>{
            console.log('error', error);
        })
    }

    viewRecord(event) {
        if (this.opportunities.length > 0) {
            this.data = this.opportunities[event.target.dataset.index];
            this.showModal = true;
        }
        console.log(JSON.stringify(event.target.dataset));
    }

    handleCancel() {
        this.showModal = false;
    }
}