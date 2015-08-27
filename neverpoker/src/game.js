function toggleLayerOn(theLayer) {
var obj = getStyleObject(theLayer);
obj.display = "block";
}

function toggleLayerOff(theLayer) {
var obj = getStyleObject(theLayer);
obj.display = "none";
}

function getStyleObject(id) {
if(document.getElementById && document.getElementById(id)) {
	return document.getElementById(id).style;
} else if (document.all && document.all(id)) {
	return document.all(id).style;
} else if (document.layers && document.layers[id]) {
	return document.layers[id];
} else {
	return false;
}
}

var gamestatus= 1;
var bet= 25;
var amtBorrow= 0;
var winnings= 100;
var back= new Image(73,97);
var picked= new Array(52);
var flipped= new Array(5);
var cards= new Array(5);
var cardvals= new Array(5);
var cardimg= new Array(52);
back.src= "img/b.gif";
for (var i = 0; i < 5; i++) { cards[i]= new Image(73,97); flipped[i] = 0; }
for (var i = 0; i < 52; i++) { cardimg[i]= new Image(73,97); cardimg[i].src = "img/" + (i+1) + ".gif"; picked[i] = 0; }

function dealcards() {
if ( gamestatus == 0 ) { gamestatus = 1; } else {
toggleLayerOff("redealDiv");
toggleLayerOn("dealDiv");
gamestatus = 0;
for ( var i = 0; i < 5; i++ ) { flipped[i] = 0; }
for ( var i = 0; i < 52; i++ ) { picked[i] = 0; }
var form = document.forms[0];
document.pokerForm.dealer.value = "Which card(s) would you like to trade?";
bet = document.pokerForm.bet.value;
if (bet<=winnings) { if (bet>0) {} else { bet=1; document.pokerForm.bet.value=1; } } else { bet=winnings; document.pokerForm.bet.value=winnings; }
winnings -= bet;
document.pokerForm.savings.value = winnings;
}
for ( var i = 0; i < 5; i++ ) {
if ( gamestatus == 0 || flipped[i] == 1 ) {
do {
var n = Math.round(Math.random() * 51);
} while ( picked[n] == 1 ); 
picked[n] = 1;
cards[i].src = cardimg[n].src;
document.images[i].src = cardimg[n].src;
cardvals[i] = n;
}
}
if ( gamestatus == 1 )
checkwin();
}

function flipcard(i) {
if ( gamestatus == 1 )
return;
if (flipped[i] == 0 ) { document.images[i].src = back.src; flipped[i] = 1;
} else { document.images[i].src = cards[i].src; flipped[i] = 0; }
}

function compare(a, b) { return a-b; }

function checkwin() {
var suits = new Array(4);
var matched = new Array(13);
var pairs = 0, threes = 0, fours = 0;
var flush = false, straight = false;
var won = 0;
cardvals.sort(compare);
for ( var i = 0; i < 4; i++ ) { suits[i] = 0; }
for ( var i = 0; i < 13; i++ ) { matched[i] = 0; }
for ( var i = 0; i < 5; i++ ) { matched[cardvals[i] % 13]++; suits[Math.floor(cardvals[i]/13)]++; }
for ( var i = 0; i < 13; i++ ) {
if ( matched[i] == 2 ) { pairs++;
} else if ( matched[i] == 3 ) { threes++;
} else if ( matched[i] == 4 ) { fours++; }
}
for ( var i = 0; i < 4; i++ ) { if ( suits[i] == 5 ) { flush = true; } }
if ( cardvals[4] - cardvals[1] == 3 && cardvals[4] - cardvals[0] == 12 && flush ) { document.pokerForm.dealer.value = "Royal flush!"; won = bet * 2500;
} else if ( cardvals[4] - cardvals[0] == 4 && flush ) { document.pokerForm.dealer.value = "Straight flush!"; won = bet * 250;
}
for ( var i = 0; i < 5; i++ )
cardvals[i] = cardvals[i] % 13;
cardvals.sort(compare);

if ( won == 0 ) {
if ( fours > 0 ) { document.pokerForm.dealer.value = "Four of a Kind!"; won = bet * 100;
} else if ( threes == 1 && pairs == 1 ) { document.pokerForm.dealer.value = "Full House!"; won = bet * 50;
} else if ( flush ) { document.pokerForm.dealer.value = "A Flush!"; won = bet * 20;
} else if ( cardvals[4] - cardvals[0] == 4 && pairs<1 && threes<1 && fours<1) { document.pokerForm.dealer.value = "A Straight!"; won = bet * 15;
} else if ( threes > 0 ) { document.pokerForm.dealer.value = "Three of a Kind."; won = bet * 4;
} else if ( pairs == 2 ) { document.pokerForm.dealer.value = "Two Pairs."; won = bet * 3;
} else if ( matched[0]  == 2 || matched[10] == 2 || matched[11] == 2 || matched[12] == 2 ) { document.pokerForm.dealer.value = "Jacks or Better..."; won = bet * 2;
} else { document.pokerForm.dealer.value = "Sorry. Want to play again?"; }
}

if ( won > 0 ) {
winnings += won;
document.pokerForm.savings.value = winnings;
document.pokerForm.dealer.value = document.pokerForm.dealer.value+" You win " + won + " Gold!";
toggleLayerOff("dealDiv");
toggleLayerOn("redealDiv");
} else {
	if (winnings>0) {
		toggleLayerOff("dealDiv");
		toggleLayerOn("redealDiv");
	} else {
		leaveTable(true);
	}
}
}

function leaveTable(b) {
if (b==true) { // broke
  document.pokerForm.dealer.value="You're broke!";
  toggleLayerOff("dealDiv");
  toggleLayerOn("brokeDiv");
} else {	   // left with gold
  document.pokerForm.dealer.value="A wise decision. Goodbye.";
  toggleLayerOff("dealDiv");
  toggleLayerOff("redealDiv");
  toggleLayerOff("brokeDiv");
  toggleLayerOn("leftDiv");
  updateScore(winnings);
}
}

function restart() {
amtBorrow++;
winnings=Math.ceil( 100/amtBorrow );
if (winnings>0) {
document.pokerForm.dealer.value="You have really generous friends!";
bet= 25;
document.pokerForm.bet.value=bet;
document.pokerForm.savings.value=winnings;
toggleLayerOff("brokeDiv");
toggleLayerOn("redealDiv");
} else {
document.pokerForm.dealer.value="No one wants to lend you some money!";
}
}