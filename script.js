//declare variables: cards, suits
var counter = 0;
var x = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
var suits = ['H','S','C','D'];
var deck = {};
var players = ['player','dealer'];
var blackjack = 1;
// localStorage.setItem('chips',100);

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

var getscoreofcards = function (who, final) { //pass who in, should return score of who's cards
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
    //check if who is player, and one ace, and one ten card
    else {
        var acecounter = 0;
        for(i=0;i<cards.length;i++){
            if(cards[i]!='A'){
                total+=cards[i]
            }
            if(cards[i]=='A'){
                acecounter++;
            }
        }
        if(acecounter==1 && cards.length == 1){
            return 11;
        }
        if(acecounter == 1 && total == 10 && cards.length == 2  && who == 'player') {
            blackjack = 1.5;
        }
        console.log(blackjack)
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
            return b;
        }
        if(final){
            return b;
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
            //check for blackjack
            if(blackjack==1.5){
                document.getElementById('winner').innerHTML = 'blackjack!'
                document.getElementById('chips').innerHTML = blackjack*parseInt(document.getElementById('chips').innerHTML)+parseInt(document.getElementById('chips').innerHTML)
            }
            if(blackjack==1){
                document.getElementById('chips').innerHTML = parseInt(document.getElementById('chips').innerHTML)+100
            }
        }
        //else lose chips
        else if (players[0]=='dealer'){
            document.getElementById('chips').innerHTML-=100
        } 
        revealNextHand()
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
        reset();
    })
    document.getElementById('morechips').addEventListener('click',function(){
        document.getElementById('chips').innerHTML = parseInt(document.getElementById('chips').innerHTML)+100
    })
}

var check17 = function(){
    if(getscoreofcards('dealer')>=17){
        return
    } else {
        hit('dealer')
        setTimeout(function(){
            check17()
        },400)
    }
}

var stand = function() {
    check17()
    setTimeout(function(){
        if(getscoreofcards('dealer')<getscoreofcards('player', true)  ){
            document.getElementById('winner').innerHTML = 'player wins!'
            if(blackjack==1.5){
                document.getElementById('winner').innerHTML = 'blackjack!'
                document.getElementById('chips').innerHTML = blackjack*parseInt(document.getElementById('chips').innerHTML)+parseInt(document.getElementById('chips').innerHTML)
            }
            if(blackjack==1){
                document.getElementById('chips').innerHTML = parseInt(document.getElementById('chips').innerHTML)+100

            }
            //check blackjack
        }
        //dealer wins
        else if (getscoreofcards('dealer') > getscoreofcards('player', true) && getscoreofcards('dealer') < 22){
            document.getElementById('winner').innerHTML = 'dealer wins!'
            document.getElementById('chips').innerHTML-=100
        }
        else if (getscoreofcards('dealer') == getscoreofcards('player',true)){
            document.getElementById('winner').innerHTML = 'push - tie'
        }
        revealNextHand()
    },1500)
    
}

//function to return hand of player || dealer
var returnhand = function (who) {
    var x = document.getElementById(who).children;
    console.log(x)
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


var reset = function () {
    //delete cards - get all divs that start with card
    var x = document.getElementById('player').children;
    for(i=0;i<x.length;i++){
        if(x[i].localName=="div"){
            var y = document.getElementById(x[i].id)
            y.remove()
            i--
        }
    }
    var a = document.getElementById('dealer').children;
    for(i=0;i<a.length;i++){
        if(a[i].localName=="div"){
            var y = document.getElementById(a[i].id)
            y.remove()
            i--
        }
    }
    updatescore('player');
    updatescore('dealer');
    document.getElementById('winner').innerHTML='';
    document.getElementById('playerbust').innerHTML='';
    document.getElementById('dealerbust').innerHTML='';
    document.getElementById('reset').style.color='grey';
    blackjack = 1;
    players = ['player','dealer'];
    hit('player');
    hit('player');
    hit('dealer');
    //clear data
    localStorage.clear()
}

var reshuffle = function (){

}


var revealNextHand = function () {
    document.getElementById('reset').style.color = 'black'
}