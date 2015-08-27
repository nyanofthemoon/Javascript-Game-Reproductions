var gridSize = 9;
var canMove = false;
var compBox = false;
var compMoveAgain;
var doneMoves;
var gameStarted = false;
boxes  = new Array(10);
vLines = new Array(10);
hLines = new Array(10);
for (i=0; i<10; i++) {
boxes[i]  = new Array(10);
vLines[i] = new Array(10);
hLines[i] = new Array(10);
}
var htype = 'h';
var vtype = 'v';
var utype = 'u';
var ctype = 'c';
var m1;
var m2;
var m3;
var m1cnt;
var m2cnt;
var m3cnt;
var userScore;
var compScore;
m1x = new Array(10);
m1y = new Array(10);
m2x = new Array(10);
m2y = new Array(10);
m3x = new Array(100);
m3y = new Array(100);
boxBlank = new Image(30,30);
boxBlank.src = 'img/blank.gif';
boxComputer = new Image(30,30);
boxComputer.src = 'img/computer.gif';
boxUser = new Image(30,30);
boxUser.src = 'img/user0.gif';
var digits = new Array(10);
for (i=0; i<10; i++) {
digits[i] = new Image(64,64);
digits[i].src = 'img/'+ i + '.gif';
}
boxVLine = new Image(5,30);
boxVLine.src = 'img/vline0.gif';
boxVLineH = new Image(5,30);
boxVLineH.src = 'img/vline1.gif';
boxHLine = new Image(35,5);
boxHLine.src = 'img/hline0.gif';
boxHLineH = new Image(35,5);
boxHLineH.src = 'img/hline1.gif';

buttonBeg = new Image(100,28);
buttonBeg.src = 'img/beginButton.gif';
buttonEnd = new Image(100,28);
buttonEnd.src = 'img/endButton.gif';

function newGame() {
gameStarted = true;
for (i=0; i<10; i++) {
for (j=0; j<10; j++) {
boxes[i][j] = 0;
vLines[i][j] = 0;
hLines[i][j] = 0;
}
}
for (j=0; j< gridSize; j++) {
for (i=0; i< gridSize; i++) {
document.images['hline'+j+i].src = boxHLine.src;
}
for (i=0; i<gridSize; i++) {
document.images['vline'+j+i].src = boxVLine.src;
document.images['box'+j+i].src = boxBlank.src;
}
document.images['vline'+j+gridSize].src = boxVLine.src;
}
for (i=0; i<gridSize; i++) {
document.images['hline'+gridSize+i].src = boxHLine.src;
}

canMove = true;
compScore = 0;
userScore = 0;
document.images['cdig1'].src = digits[0].src;
document.images['cdig2'].src = digits[0].src;
document.images['udig1'].src = digits[0].src;
document.images['udig2'].src = digits[0].src;
}

function clickButton() {
if (gameStarted == true) {
endGame();
compScore = 0;
userScore = 0;
document.images['cdig1'].src = digits[0].src;
document.images['cdig2'].src = digits[0].src;
document.images['udig1'].src = digits[0].src;
document.images['udig2'].src = digits[0].src;
} else {
document.images['buttonImg'].src = buttonEnd.src;
newGame();
}
}

function endGame() {
canMove = false;
var totScore = gridSize * gridSize;
gameStarted = false;
if ((compScore *1 + userScore*1) < totScore) {
compScore = totScore - userScore;
displayScore(compScore, 'cdig');
}
if (userScore > compScore) { // won
if ((compScore*1 + userScore*1) >= (gridSize * gridSize)) { updateScore(999999999); } else {}
} else { // lost
}
document.images['buttonImg'].src = buttonBeg.src;
}

function highLight(ltype, y, x) {
if (ltype == "h") {
var imgName = 'hline'+y+x;
document.images[imgName].src = boxHLineH.src; 
} else {
var imgName = 'vline'+y+x;
document.images[imgName].src = boxVLineH.src; 
}
}

function unHighLight(ltype, y, x) {
if (ltype == "h") {
if (hLines[y][x] != 1) {
var imgName = 'hline'+y+x;
document.images[imgName].src = boxHLine.src; 
}
} else {
if (vLines[y][x] != 1) {
var imgName = 'vline'+y+x;
document.images[imgName].src = boxVLine.src; 
}}}

function addLine(mtype, ltype, y, x) {
if (mtype == utype && canMove == false) {
return;
}
compMoveAgain = false;
compBox = false;
if (ltype == 'h') {
if (hLines[y][x] == 0) {
hLines[y][x] = 1;
var imgName = 'hline'+y+x;
document.images[imgName].src = boxHLineH.src; 
addBox(mtype, y, x);
if (y  > 0) {
addBox(mtype, y*1-1, x);
}
} else {
if (mtype == utype) {
return;
}}
} else {
if (vLines[y][x] == 0) {
vLines[y][x] = 1;
var imgName = 'vline'+y+x;
document.images[imgName].src = boxVLineH.src;
addBox(mtype, y, x);
if (x  > 0) {
addBox(mtype, y, x*1-1);
}
} else {
if (mtype == utype) {
return;
}}}

if ((compBox == false) && (mtype == utype) && (gameStarted == true)) {
setTimeout(compMove,200);
} else {
if (mtype == ctype && compBox == true) {
compMoveAgain = true;
}}}

function addBox(mtype, y, x) {
var gotBox;
boxes[y][x] = (boxes[y][x])*1 +1;
gotBox = false
if (boxes[y][x] > 3) {
var imgName = 'box'+y+x;
if (mtype == utype) {
document.images[imgName].src = boxUser.src;
} else {
document.images[imgName].src = boxComputer.src;
}
updScore(mtype);
compBox = true;
}}

function updScore(mtype) {
var dig1;
var dig2;
if (mtype == utype) {
userScore = userScore * 1 + 1;
displayScore(userScore, 'udig');
} else {
compScore = compScore * 1 + 1;
displayScore(compScore, 'cdig');
}
if ((compScore*1 + userScore*1) >= (gridSize * gridSize)) {
endGame();
}}

function displayScore(score, imgName) {
var dig1 = Math.floor(score / 10);
var dig2 = score % 10;
document.images[imgName + '1'].src = digits[dig1].src;
document.images[imgName + '2'].src = digits[dig2].src;
}

function compMove() {
if (gameStarted == false) {
return;
}
canMove = false;
compMoveAgain = false;
computerTurn();
if (compMoveAgain == false) {
canMove = true;
} else {
setTimeout(compMove,400);
}}

function computerTurn() {
var boxY;
var boxX;
var cBoxY;
var cBoxX;
var foundMove;
var lpos;
m1cnt = 0;
m2cnt = 0;
m3cnt = 0;
doneMoves = true;

for (i=0; i<gridSize; i++) {
for (j=0; j<gridSize; j++) {
if (boxes[i][j] == 3) {
if (m1cnt < 10) {
m1x[m1cnt] = j;
m1y[m1cnt] = i;
m1cnt = m1cnt * 1 + 1;
}
} else if (boxes[i][j] == 2) {
if (m2cnt < 10) {
m2x[m2cnt] = j;
m2y[m2cnt] = i;
m2cnt = m2cnt * 1 + 1;
}
} else if (boxes[i][j] < 2) {
if (m3cnt < 100) {
m3x[m3cnt] = j;
m3y[m3cnt] = i;
m3cnt = m3cnt * 1 + 1;
}}}}

if (m1cnt > 0) {
lpos = Math.floor(Math.random() * m1cnt);
boxX = m1x[lpos];
boxY = m1y[lpos];
} else if (m3cnt > 0) {
lpos = Math.floor(Math.random() * m3cnt);
boxX = m3x[lpos];
boxY = m3y[lpos];
} else if (m2cnt > 0) {
lpos = Math.floor(Math.random() * m2cnt);
boxX = m2x[lpos];
boxY = m2y[lpos];
}

cBoxY = boxY;
cBoxX = boxX;
foundMove = false;
compMoveAgain = false;

if (Math.floor(Math.random() * 2) == 1) {
for (j=0; j<2 && foundMove == false; j++) {
cBoxY = (boxY*1 + j*1);
if (cBoxY >= 0 && cBoxY <= gridSize) {
if (hLines[cBoxY][cBoxX] == 0) {
addLine(ctype, htype, cBoxY, cBoxX);
foundMove = true;
}}}

cBoxY = boxY;
cBoxX = boxX;
}

for (i=0; i< 2 && foundMove == false; i++) {
cBoxX = (boxX*1 + i*1);
if (cBoxX >= 0 && cBoxX <= gridSize) {
if (vLines[cBoxY][cBoxX] == 0) {
addLine(ctype, vtype, cBoxY, cBoxX);
foundMove = true;
}}}

cBoxX = boxX;
for (j=0; j<2 && foundMove == false; j++) {
cBoxY = (boxY*1 + j*1);
if (cBoxY >= 0 && cBoxY <= gridSize) {
if (hLines[cBoxY][cBoxX] == 0) {
addLine(ctype, htype, cBoxY, cBoxX);
foundMove = true;
}}}}