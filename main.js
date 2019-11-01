var data;
var members;
var stats = {
        democrats: [],
        republicans: [],
        independents: [],
        total: 0,
        party_votes_dem: 0,
        party_votes_rep: 0,
        party_votes_ind: 0,
        party_votes_total: 0,
        least_engaged: [],
        most_engaged: [],
        least_loyal: [],
        most_loyal: [],
    }
    
 //Get data FETCH Fn
    function getdata (url,apikey){
        fetch (url, {
            method: 'GET',
            headers: {
            'X-API-Key': apikey }
        })
        .then (function(response){
               if (response.ok){
            return response.json();
               }else {throw new Error()}
        })
        .then (function(result){
            data = result
            app.members = data.results[0].members;
            members = data.results[0].members;
            statistics();
            statesdropdown();
        })
        .catch(function(error){
            console.log(error)
        })
    }
    
    let url = document.getElementById ("senate") ? "https://api.propublica.org/congress/v1/113/senate/members.json" : "https://api.propublica.org/congress/v1/113/house/members.json"
    getdata(url,"LlPWPq5byn25pMmccjydnX6F4QVSQXmd7636VYcB");
    



    //------------------- VUE ----------------------//
    var app = new Vue ({  
        el: "#app",  
        data: {    
            members: [],
        },
        computed: {
            filteredmembers(){
               return this.members.filter(e => checkbox.checkedparties.includes(e.party) && (dropdown.selectedstate == e.state || dropdown.selectedstate == "all") ? e : null);
            }
        }
    })
    
    var checkbox = new Vue ({  
        el: "#checkbox",  
        data: {    
            checkedparties: ["R", "D", "I"]
        }
    })
    
    var dropdown = new Vue ({
        el: "#dropdown",
        data: {
            states: [],
            selectedstate: "all"
        }
    })
    
    var sidetable = new Vue ({
        el: "#sidetable",
        data: {
            stats: stats,
        }
    })
    
    var tables = new Vue ({
        el: "#tables",
        data: {
            stats: stats,
        }
    })
    //------------------- VUE ----------------------//
    
    
    
    // Dropdown Generator FN
    function statesdropdown(){
        
        for (let i=0; i<members.length; i++){
            if (!dropdown.states.includes(members[i].state)){
                dropdown.states.push(members[i].state)
            }
        }
        
        dropdown.states.sort()
    }
    
    
// STATS FN
function statistics (){
    
    stats.total = members.length;
    
for (let i=0; i<members.length; i++){
    switch (members[i].party){
        case "D":
            stats.democrats.push(members[i]);
            break;
        case "R":
            stats.republicans.push(members[i]);
            break;
        case "I":
            stats.independents.push(members[i]);
            break;
    }
} 
    
//pct votes of each party
stats.party_votes_dem = parseFloat(pct(aux(stats.democrats)));
stats.party_votes_rep = parseFloat(pct(aux(stats.republicans)));
stats.party_votes_ind = stats.independents != 0 ? parseFloat(pct(aux(stats.independents))) : "0"
stats.party_votes_total = stats.independents != 0 ? parseFloat(((stats.party_votes_dem + stats.party_votes_ind + stats.party_votes_rep)/3).toFixed(2)) : "-"
//10% most-least
stats.most_loyal = toptenpct(members, "votes_with_party_pct")
stats.least_loyal = btmtenpct(members, "votes_with_party_pct")
stats.most_engaged = btmtenpct(members, "missed_votes_pct")
stats.least_engaged = toptenpct(members, "missed_votes_pct")
}
    


//Aux Fn
function aux (arr){
    let aux = [];
    for (let i=0; i<arr.length; i++) {
        aux.push(arr[i].votes_with_party_pct);
    }
    return aux;
}

//Percentage Fn
function pct (arr) {
    let total = 0;
    let qty = arr.length
    for (let i=0; i<qty; i++) {
        total += arr[i];
    }
    return (total/qty).toFixed(2);
}



//Function Top 10%
function toptenpct (arr,key){
    arr.sort(function(a,b){return b[key] - a[key]})
    let auxarr = []
    let length10 = arr.length/10
    let i = 0
    while (auxarr.length <= length10 || arr[i] == arr[i+1]){
        auxarr.push(arr[i])
        i++
    }
    return auxarr;
}

//Function Bottom 10%
function btmtenpct (arr,key){
    arr.sort(function(a, b){return a[key] - b[key]});
    let auxarr = []
    let length10 = arr.length/10
    let i = 0
    while (auxarr.length <= length10 || arr[i] == arr[i+1]){
        auxarr.push(arr[i])
        i++
    }
    return auxarr;
}



