public with sharing class OpportunityFilterController {
    
    @AuraEnabled
    public static List<Opportunity> getOpportunities (String accountName){

        return [
            SELECT Id, Name, StageName, LastModifiedDate 
            FROM Opportunity 
            WHERE Account.Name =: accountName
        ];
    }
}