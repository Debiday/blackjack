//declare variables: cards, suits
var counter = 0;
var x= ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
var suits = ['H','S','C','D'];
var deck = {};
var players = ['player','dealer']

//make a deck
for(i=0;i<300;i++){
    var suit = Math.floor(Math.random()*4);
    var z = (x[Math.floor(Math.random()*13)].concat(suits[suit]));
    if (!Object.values(deck).includes(z)){
        deck[i] = z;
    }
}
var arr = (Object.values(deck).sort());

var hit = function (who) {
    counter = Math.abs(arr.length-52);
    var h = arr[Math.floor(Math.random()*arr.length)];
    console.log(h, counter);
    //delete card from decks
    arr = arr.filter(e => e !== h); 
    //create object card to append to DOM
    var card = document.createElement('div'); 
    card.id= 'card' + parseInt(counter);
    card.innerHTML = h;
    document.getElementById(who).appendChild(card);
    updatescore(who);
}

var getscoreofcards = function (who,final) { //pass who in, should return score of who's cards
    var cards = returnhand(who);
    var total = 0;
    for(i = 0; i < cards.length; i++){ 
        //convert J, Q, K to 10
        if (cards[i] == 'J' || cards[i] == 'Q' || cards[i] == 'K') { 
            cards[i] = '10';
        }
        if (cards[i]!='A'){
            cards[i]=parseInt(cards[i])
        }
    }
    // if it doesn't contain A -> calc score
    if(!cards.includes('A')){
        for(i=0;i<cards.length;i++){
            total+=cards[i]
        }
        return total;
    }
    // if it contains 1 or more Ace.
    else {
        var acecounter = 0;
        if(acecounter==1){
            return 11;
        }
        for(i=0;i<cards.length;i++){
            if(cards[i]!='A'){
                total+=cards[i]
            }
            if(cards[i]=='A'){
                acecounter++;
            }
        }
        // return 11 + total, or all 1s and total
        var a = acecounter + total;
        var b = 10 + total + acecounter;
        if (b == 21){
            return 21;
        }
        else if (b > 21){
            return a;
        } 
        if (who=='dealer'){
            return b
        }
        return ('total is '+ a.toString() + ' or ' + b.toString());
    }
}

var updatescore = function (who) {
    //return score/ update score
    var y = getscoreofcards(who)
    if(y > 21){
        document.getElementById(who+'bust').innerHTML = 'bust'
        players.splice(players.indexOf(who), 1)
        console.log(players)
        document.getElementById('winner').innerHTML = players[0] + ' wins!'
        //if dealer goes bust, multiply chips times 2
        if(players[0]=='player'){
            // convert string to int
            document.getElementById('chips').innerHTML = parseInt(document.getElementById('chips').innerHTML)+100
        }
        //else lose chips
        else if (players[0]=='dealer'){
            document.getElementById('chips').innerHTML-=100
        } 
    } 
    document.getElementById(who+'score').innerHTML = y
}

//pull 3 cards
window.onload=function(){
    hit('player');
    hit('player');
    hit('dealer');

    //listen to buttons
    document.getElementById('hit').addEventListener("click",function(){
        hit('player');
    })
    document.getElementById('stand').addEventListener("click",function(){
        stand()
    })
    document.getElementById('reset').addEventListener('click',function(){
        location.reload();
    })
}

var stand = function() {
    while (getscoreofcards('dealer')<17){
        hit('dealer')
    }
    //player wins
    if(getscoreofcards('dealer')<getscoreofcards('player')  ){
        document.getElementById('winner').innerHTML = 'player wins!'
        document.getElementById('chips').innerHTML = parseInt(document.getElementById('chips').innerHTML)+100
    }
    //dealer wins
    else if (getscoreofcards('dealer') > getscoreofcards('player') && getscoreofcards('dealer') < 22){
        document.getElementById('winner').innerHTML = 'dealer wins!'
        document.getElementById('chips').innerHTML-=100
    }
    else if (getscoreofcards('dealer') == getscoreofcards('player')){
        document.getElementById('winner').innerHTML = 'push - tie'
    }
}

//function to return hand of player || dealer
var returnhand = function (who) {
    var x = document.getElementById(who).children;
    var cards = []
    for(i=0;i<x.length;i++){
        if(x[i].localName=="div"){
            //get scores of all cards
            cards.push(x[i].innerHTML)
        }
    }
    for(i = 0; i < cards.length; i++){
        //remove last letter / suit
        cards[i] = cards[i].substring(0, cards[i].length - 1) 
    }
    console.log('hand is',cards)
    return cards
}
