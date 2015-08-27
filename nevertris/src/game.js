var piece=new Object;
var nextpiece=new Object;
var chpdebug=new Object;

var plateau=new Array(11*25);
var bkground=new Array(11*25);
var chpligne=new Object;
var chplevel=new Object;
var chpscore=new Object;

var lay1=new Object();
var lay2=new Object();

var cont=new Object();
cont.left=0;
cont.right=0;
cont.rotate=0;
cont.down=0;
cont.godown=0;
cont.downup=1;
cont.fallingcounter=0;

var cspeed=1.0;
var IE=false;
var score=0;
var partie=0;
var pcounter=0;
var laps=35;

var level=1;
var initiallevel=1;
var coups=0;
var lignes=0;
var pause=0;
var immediatlaps;
var hdlproc;
var pause=0;
var nbbrique=0;
var transitionpiece=0;
var transitioncounter=0;
var tclr=new Array(10);
tclr[0]="#ff3300";
tclr[1]="#ee0000";
tclr[2]="#bb0000";
tclr[3]="#aa0000";
tclr[4]="#880000";
tclr[5]="#770000";
tclr[6]="#550000";
tclr[7]="#440000";
tclr[8]="#220000";
tclr[9]="#110000";
var gcounter=0;

function whichKey(e)  {
if (!e) var e = window.event;
if (e.keyCode) x = e.keyCode;
else if (e.which) x = e.which;
switch (x) {
case 37: if (cont.left==0) cont.left=1; return;
case 38: cont.rotate=1; cont.hasrotated=0; return;
case 39: if (cont.right==0) cont.right=1; return;
case 40: if (cont.downup==1) { cont.down=1; cont.godown=1; cont.downup=0; } return; }
}

function upbutton(e) {
if (!e) var e = window.event;
if (e.keyCode) x = e.keyCode;
else if (e.which) x = e.which;
switch (x) {
case 37: cont.left=0; return;
case 38: cont.rotate=0; return;
case 39: cont.right=0; return;
case 40: cont.down=0; cont.downup=1; return; }
}

function pausegame() { if (partie!=1) return; var el=document.getElementById("State"); if (el.value=="Pause") { startGame(el); } }

function animate() {
var ind=gcounter%18;
if (ind > 9) ind=18-ind; title.style.color=tclr[ind]; gcounter++;
if (pause==1) { var td=document.getElementById("cellpause"); td.style.color=tclr[ind]; }
if (partie==0) {
if (lay2.style.visibility=="visible") { var gmov=document.getElementById("gameover"); gmov.style.color=tclr[ind]; }
}
}

function startGame(f) {
if(f.value=="Begin") { initialize(); f.value="Pause"; f.style.visibility="visible"; return; }
if (f.value=="Pause") {
f.value="Continue"; lay1.style.visibility="visible"; pause=1;
cont.left=0;
cont.right=0;
cont.rotate=0;
cont.down=0;
return;
};
if (f.value=="Continue") { f.value="Pause"; lay1.style.visibility="hidden"; pause=0; return; };
}

function draw_color(byid,col) { var el=document.getElementById(byid); el.bgColor=getcolor(col); }

function getlaps(l) {
var futurelaps=27-3*l;
if (l < 6) futurelaps=31-4*l; 
if (l==6) futurelaps=9;
if (l==7) futurelaps=7;
if (l>7) futurelaps=14-level;
if (futurelaps < 5) futurelaps=5;
return futurelaps;
}

function initialize() {
if (document.all) { IE=true; } else { IE=false; }
initback();
var thislevel=1;
level=thislevel;
initiallevel=level;
thislevel--;
score=19*((((thislevel+2)*(thislevel+3))/2)-3);
if (level==1) score=0;
laps=Math.floor(getlaps(level)/cspeed);
lignes=13*thislevel;
coups=10*thislevel;
partie=1;
pcounter=0;
piece=createpiece();
piece2=createpiece();
show_piece(piece);
nbbrique+=4;
lay2.style.visibility="hidden";
show_next_piece(piece2);
chpligne.value=lignes;
chplevel.value=level;
chpscore.value=0;
cont.left=0;
cont.right=0;
cont.rotate=0;
cont.down=0;
cont.hasrotated=1;
cont.godown=0;
cont.fallingcounter=0;
var but=document.getElementById("State");
but.style.visibility="hidden";
hdlproc=setInterval ("mainproc()",24);
return;
}

function endgame() {
partie=0;
var str="";
updateScore(score);
clearInterval(hdlproc);
lay2.style.visibility="visible";
var but=document.getElementById("State");
but.value="Begin";

}

function mainproc() {
if ((partie==0)||(pause==1)) return;

if (transitionpiece==1) {
transitioncounter++;
if (transitioncounter < 20) return;
piece=piece2;
nbbrique+=4;
piece2=createpiece();
show_piece(piece);
if (!validatepos(piece,piece.x,piece.y,0))  { 

endgame();
return;
}
show_next_piece(piece2);
transitioncounter=transitionpiece=0;
}
var movedown=0;
immediatlaps=laps;
pcounter++;

if (cont.godown!=1) {
if ((cont.left>0) && (cont.right==0)) {
 
if (pcounter%2==0) {
if(cont.left!=2) {
if(validatepos(piece,piece.x-1,piece.y,0)) {
remove_piece(piece);
piece.x-=1;
show_piece(piece);
}
}
if (cont.left < 3) cont.left++; }
}
if (cont.rotate==1) {
if ((pcounter%2==0) && (cont.hasrotated==0)) {
if(validatepos(piece,piece.x,piece.y,1)) {
remove_piece(piece);
piece.coords=rotate(piece.coords);
cont.hasrotated=1;
show_piece(piece);
} else {
var decal=0;
if (piece.x < 4) decal=1;
if (piece.x > 7) decal=-1;
if(validatepos(piece,piece.x+decal,piece.y,1)) {
remove_piece(piece);
piece.x+=decal;
piece.coords=rotate(piece.coords);
cont.hasrotated=1;
show_piece(piece);
} else {
var decal=0;
if (piece.x < 4) decal=2;
if (piece.x > 7) decal=-2;
if (validatepos(piece,piece.x+decal,piece.y,1)) {
remove_piece(piece);
piece.x+=decal;
piece.coords=rotate(piece.coords);
cont.hasrotated=1;
show_piece(piece);
}
}
}
}
}
if ((cont.left==0) && (cont.right>0)) {
if (pcounter%2==0) {
if (cont.right!=2) {
if (validatepos(piece,piece.x+1,piece.y,0)) {
remove_piece(piece);
piece.x+=1;
show_piece(piece);
}
}
if (cont.right < 3) cont.right++; }
}
}
if (cont.godown==1) { if (pcounter%2==0) immediatlaps=2; }


if ((pcounter%immediatlaps)==0) movedown=1;
if (movedown!=1) return;
movedown=0;
if(validatepos(piece,piece.x,piece.y-1,0)==true) {

remove_piece(piece);
piece.y-=1;
show_piece(piece);
return;
};
cont.godown=0;
write_piece(piece);
var plusl=0;
plusl=remove_lines();
if (plusl>0) {
lignes+=plusl;

coups++;
score+=((2+level)*(plusl*plusl));
if (nbbrique==0) score+=500;
chpscore.value=score;
var futurelevel=Math.floor(coups/10)+1;
if (level < futurelevel) {
level=futurelevel;
laps=Math.round(getlaps(level)/cspeed);
chplevel.value=level;
}
chpligne.value=lignes;
}

transitionpiece=1;
transitioncounter=0;
};

function remove_lines() {
var str="";
var i,j,flag;
var decal=0;
var vmin=piece.y-2;
var vmax=piece.y+2;
if (vmin < 0) vmin=0;
if (vmax > 24) vmax=24;
for (i=vmin; i <= vmax; i++) {
flag=1;
for (j=0; j < 11; j++) {
if (plateau[getrank(j,i)]==0) {
flag=0;
j=11;
}
}
if (flag==1) {
decal++;
nbbrique-=11;
}
if ((decal>0)&&(flag==1)) {
for (j=0; j < 11; j++) {
plateau[getrank(j,i)]=bkground[getrank(j,i)]=0;
str="draw_color(\""+(11*i+j)+"\",7);";
eval(str);
}
}
if ((decal>0)&&(flag==0)) {
for (j=0; j < 11; j++) {
plateau[getrank(j,i-decal)]=bkground[getrank(j,i-decal)]=plateau[getrank(j,i)];
str="draw_color(\""+(j+11*(i-decal))+"\","+plateau[getrank(j,i)]+");";
eval(str);
plateau[getrank(j,i)]=bkground[getrank(j,i)]=0;
str="draw_color(\""+(11*i+j)+"\",0);";
eval(str);
}

}
}
if (decal==0) return decal;
for (i=vmax+1; i < 25; i++) {
for (j=0; j < 11; j++) {
plateau[getrank(j,i-decal)]=bkground[getrank(j,i-decal)]=plateau[getrank(j,i)];
str="draw_color(\""+(j+11*(i-decal))+"\","+plateau[getrank(j,i)]+");";
eval(str);
plateau[getrank(j,i)]=bkground[getrank(j,i)]=0;
str="draw_color(\""+(11*i+j)+"\",0);";
eval(str);
}
}

return decal;
}


function initback() {
var i,j;
for (i=0; i < 11; i++)  {
for (j=0; j < 25; j++)  {
plateau[getrank(i,j)]=bkground[getrank(i,j)]=0;
draw_color(""+(11*j+i),0);
};
};
}

function createpiece() {
var p=new Object;
var coords=new Array(8);
p.type=Math.floor(Math.random()*7)+1;
p.color=Math.floor(Math.random()*6)+1;
coords=genpiece(p.type);
p.coords=coords;
p.x=4; p.y=22;
return p;
}

function rotate(tb) {
tb2=new Array(8)
for (i=0; i < 4; i++) {
tb2[2*i]=tb[2*i+1];
tb2[2*i+1]=-tb[2*i];
}
return tb2;
}

function getrank(cx,cy) { return (cx+11*cy); }

function remove_piece(p) {
var i=0; var rx,ry;
var str="";
for (i=0; i < 4; i++) {
rx=p.x+p.coords[2*i];
ry=p.y+p.coords[2*i+1];
plateau[getrank(rx,ry)]=0;
str="draw_color(\""+(11*ry+rx)+"\",0);"
eval(str);
}
}

function show_piece(p) {
var i=0; var rx,ry;
var str="";
for (i=0; i < 4; i++) {
rx=p.x+p.coords[2*i];
ry=p.y+p.coords[2*i+1];
plateau[getrank(rx,ry)]=p.color;
str="draw_color('"+(11*ry+rx)+"',"+p.color+");";
eval(str);
}
}

function show_next_piece(p) {
var i=0; var rx,ry;
var str="";
var tb2=new Object;
for(i=0;i<15;i++) {
tb2=document.getElementById("p"+i);
tb2.bgColor="#000000";
}
for (i=0; i < 4; i++) {
rx=1+p.coords[2*i];
ry=1+p.coords[2*i+1];
str="p"+(rx+4*ry);
tb2=document.getElementById(str);
tb2.bgColor=getcolor(p.color);
}
}

function write_piece(p) {
var i=0; var rx,ry;
var str="";
for (i=0; i < 4; i++) {
rx=p.x+p.coords[2*i];
ry=p.y+p.coords[2*i+1];
bkground[getrank(rx,ry)]=p.color; }
}

function validatepos(p,cx,cy,rotat) {
var tb=new Array(8);
tb=p.coords; var i=0;
var rx,ry;
if (rotat==1) tb=rotate(tb);
for (i=0; i < 4; i++) {
rx=cx+tb[2*i];
ry=cy+tb[2*i+1];
if ((rx < 0)||(rx > 10)) return false;
if ((ry < 0)||(ry > 24)) return false;
if (bkground[getrank(rx,ry)]!=0) return false;
}
return true;
}
function getcolor(n) {
switch (n) {
case 0: return "#000000";
case 1: return "#ff0000";
case 2: return "#00ff00";
case 3: return "#0000ff";
case 4: return "#ffff00";
case 5: return "#ff00ff";
case 6: return "#00ffff";
case 7: return "#ffffff"; }
}

function genpiece(tp)
{
var tb=new Array(8);
var i=0;

switch (tp) {
case 1: tb[0]=0;tb[1]=0;tb[2]=1;tb[3]=0;tb[4]=0;tb[5]=1;tb[6]=1;tb[7]=1; return tb;
case 2: tb[0]=-1;tb[1]=0;tb[2]=0;tb[3]=0;tb[4]=1;tb[5]=0;tb[6]=2;tb[7]=0; return tb;
case 3: tb[0]=0;tb[1]=-1;tb[2]=0;tb[3]=0;tb[4]=1;tb[5]=0;tb[6]=2;tb[7]=0; return tb;
case 4: tb[0]=0;tb[1]=1;tb[2]=0;tb[3]=0;tb[4]=1;tb[5]=0;tb[6]=2;tb[7]=0; return tb;
case 5: tb[0]=0;tb[1]=-1;tb[2]=0;tb[3]=0;tb[4]=1;tb[5]=0;tb[6]=1;tb[7]=1; return tb;
case 6: tb[0]=1;tb[1]=-1;tb[2]=1;tb[3]=0;tb[4]=0;tb[5]=0;tb[6]=0;tb[7]=1; return tb;
case 7: tb[0]=-1;tb[1]=0;tb[2]=0;tb[3]=0;tb[4]=1;tb[5]=0;tb[6]=0;tb[7]=1; return tb; }
}