public with sharing class OpportunitiesController {
    
    @AuraEnabled
    public static List<Opportunity> fetchOpportunity (String accountNameStr, String oppStageName) {
        //Empty Lists for operations 
        List<Opportunity> opps = new List<Opportunity>();
        List<Account> accountsWithOpps = new List<Account>();

        //creating temp vars for query
        String tempAccName = '%' + accountNameStr + '%';
        String tempOppStageName = '%' + oppStageName + '%';
        
        //fetching account's opps and adding it to opps master list which we will return in the end
        for(Account acc: [SELECT Id, Name, (Select Id, Name, Amount, CloseDate, StageName from Opportunities 
        WHERE StageName LIKE :tempOppStageName) from Account WHERE Name LIKE :tempAccName]){ 
            for(Opportunity opp: acc.Opportunities){
                opps.add(opp);
            }
        }
        System.debug(opps);
        //Checking if stageName is blank then only return first 10 opps
        // if(accountNameStr != '' && oppStageName != ''){
            if(String.isBlank(oppStageName)){
                List<Opportunity> tempOpps = new List<Opportunity>();
                if(opps.size() >= 10){
                        for(Integer a = 0; a < 10; a++){
                        tempOpps.add(opps[a]);
                    }
                    opps = tempOpps;
                }
            }
        // }
        return opps;
    }
}