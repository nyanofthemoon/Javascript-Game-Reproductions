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

var i, j, IsOver, Size=10, dSize=0, NCol=7, NNext=3, Score=0, I_Sel, J_Sel, IsAni;
var scoreMod=1;

var Next=new Array(NNext);
var Fld=new Array(Size); for (i=0; i<Size; i++) { Fld[i]=new Array(Size); }

function setLevel(nn) {
  toggleLayerOff("easyMode");
  toggleLayerOff("averageMode");
  toggleLayerOff("hardMode");
  switch(parseInt(nn)) {
  case 1: NCol=6; dSize=0; scoreMod=0; toggleLayerOn("easyMode"); break;
  case 2: NCol=7; dSize=0; scoreMod=1; toggleLayerOn("averageMode"); break;
  case 3: NCol=7; dSize=1; scoreMod=2; toggleLayerOn("hardMode"); break;
  default: break; }
  toggleLayerOff("newGame");
  toggleLayerOn("inGame");
  Score=Score-scoreMod;
  document.forms[0].Score.value=Score;
  Init();
}

function getNewGame() {
 toggleLayerOn("newGame");
 toggleLayerOff("inGame");
}

function baseInit() {
var ii, jj;
  for (ii=0; ii<Size; ii++)
  { for (jj=0; jj<Size; jj++)
    { Fld[ii][jj]=0;
      document.images[jj*Size+ii].src=PicT[0].src;
    }  
  }
  for (ii=dSize; ii<Size-dSize; ii++)
  { for (jj=dSize; jj<Size-dSize; jj++)
    { Fld[ii][jj]=0;
      document.images[jj*Size+ii].src=Pic[0].src;
    }  
  }
  Score=0;
  document.forms[0].Score.value=Score;
}

Pic=new Array(8);
for (i=0; i<8; i++){ Pic[i]=new Image(); Pic[i].src="img/ball"+i+"t.gif"; }
PicT=new Array(8);
for (i=0; i<8; i++) { PicT[i]=new Image(); PicT[i].src="img/ball"+i+".gif"; }
if (! document.layers)
  PicT[0].src="img/transparent.gif";

function random(nn){ return(Math.round(Math.random()*1000)%nn); }

function Init()
{ var ii, jj;
  for (ii=0; ii<Size; ii++)
  { for (jj=0; jj<Size; jj++)
    { Fld[ii][jj]=0;
      document.images[jj*Size+ii].src=PicT[0].src;
    }  
  }
  for (ii=dSize; ii<Size-dSize; ii++)
  { for (jj=dSize; jj<Size-dSize; jj++)
    { Fld[ii][jj]=0;
      document.images[jj*Size+ii].src=Pic[0].src;
    }  
  }
  GetNext();
  PutNext();
  GetNext();
  I_Sel=-1;
  IsOver=false;
  IsAni=false;
  Score=0;
  document.forms[0].Score.value=Score;
}

function GetNext() { 
var ii;
Score=Score+scoreMod;
document.forms[0].Score.value=Score;
  for (ii=0; ii<NNext; ii++)
  { Next[ii]=1+random(NCol);
    document.images[Size*Size+ii].src=PicT[Next[ii]].src;
  }
}

function PutNext() {
var ii, jj, kk, nn, rr;
  for (kk=0; kk<NNext; kk++)  
  { nn=0;
    for (ii=dSize; ii<Size-dSize; ii++)
    { for (jj=dSize; jj<Size-dSize; jj++)
      { if (Fld[ii][jj]==0) nn++;
      }
    }
    if (nn==0)
    { 
      updateScore(Score);
      IsOver=true;
      return;
    }
    rr=random(nn)+1;
    nn=0;
    for (ii=dSize; ii<Size-dSize; ii++)
    { for (jj=dSize; jj<Size-dSize; jj++)
      { if (Fld[ii][jj]==0) nn++;
        if (nn==rr)
        { Fld[ii][jj]=Next[kk];
          document.images[jj*Size+ii].src=Pic[Next[kk]].src;
          nn++;
          RemoveTest(ii, jj);
        }
      }
    }
  }
  nn=0;
  for (ii=dSize; ii<Size-dSize; ii++)
  { for (jj=dSize; jj<Size-dSize; jj++)
    { if (Fld[ii][jj]==0) nn++;
    }
  }
  if (nn==0)
  { 
  	updateScore(Score);
    IsOver=true;
  }
}

function Clicked(ii, jj) {
var nn, mm;
  if (IsOver) return;
  if (IsAni) return;
  if ((ii<dSize)||(ii>Size-dSize-1)||(jj<dSize)||(jj>Size-dSize-1)) return;
  if (I_Sel==-1)
  { if (Fld[ii][jj]>0)
    { I_Sel=ii;
      J_Sel=jj;
      document.images[jj*Size+ii].src=PicT[Fld[ii][jj]].src;
    }
    return;
  }
  if (Fld[ii][jj]>0)
  { document.images[J_Sel*Size+I_Sel].src=Pic[Fld[I_Sel][J_Sel]].src;
    I_Sel=ii;
    J_Sel=jj;
    document.images[jj*Size+ii].src=PicT[Fld[ii][jj]].src;
    return;
  }
  if (GetMoveLine(ii, jj, 1))
  { isAni=true;
    MoveAni(I_Sel, J_Sel);
  }
  else
  { for (nn=0; nn<Size; nn++)
    { for (mm=0; mm<Size; mm++)
      { if (Fld[nn][mm]<0) 
          Fld[nn][mm]=0;
      }
    }
  }
} 

function MoveAni(ii, jj) {
var nn, mm, vv, vv_best=-1000;
  if (Fld[ii][jj]==-1)
  { for (nn=0; nn<Size; nn++)
    { for (mm=0; mm<Size; mm++)
      { if (Fld[nn][mm]<0) 
          Fld[nn][mm]=0;
      }
    }
    Fld[ii][jj]=Fld[I_Sel][J_Sel];
    Fld[I_Sel][J_Sel]=0;
    vv=RemoveTest(ii, jj);
    IsAni=false;
    if (vv==0)
    { PutNext();
      GetNext();
    }  
    I_Sel=-1; 
    return;
  }
  if (ii>0) 
  { vv=Fld[ii-1][jj];
    if ((vv<0)&&(vv>vv_best)) vv_best=vv;
  }
  if (ii<Size-1) 
  { vv=Fld[ii+1][jj];
    if ((vv<0)&&(vv>vv_best)) vv_best=vv;
  }
  if (jj>0) 
  { vv=Fld[ii][jj-1];
    if ((vv<0)&&(vv>vv_best)) vv_best=vv;
  }
  if (jj<Size-1) 
  { vv=Fld[ii][jj+1];
    if ((vv<0)&&(vv>vv_best)) vv_best=vv;
  }

  if (ii>0) 
  { vv=Fld[ii-1][jj];
    if (vv==vv_best)
    { document.images[jj*Size+ii].src=Pic[0].src;
      document.images[jj*Size+(ii-1)].src=Pic[Fld[I_Sel][J_Sel]].src;
      setTimeout("MoveAni("+eval(ii-1)+","+jj+")",100);
      return;
    }
  }
  if (ii<Size-1) 
  { vv=Fld[ii+1][jj];
    if (vv==vv_best)
    { document.images[jj*Size+ii].src=Pic[0].src;
      document.images[jj*Size+(ii+1)].src=Pic[Fld[I_Sel][J_Sel]].src;
      setTimeout("MoveAni("+eval(ii+1)+","+jj+")",100);
      return;
    }
  }
  if (jj>0) 
  { vv=Fld[ii][jj-1];
    if (vv==vv_best)
    { document.images[jj*Size+ii].src=Pic[0].src;
      document.images[(jj-1)*Size+ii].src=Pic[Fld[I_Sel][J_Sel]].src;
      setTimeout("MoveAni("+ii+","+eval(jj-1)+")",100);
      return;
    }
  }
  if (jj<Size-1) 
  { vv=Fld[ii][jj+1];
    if (vv==vv_best)
    { document.images[jj*Size+ii].src=Pic[0].src;
      document.images[(jj+1)*Size+ii].src=Pic[Fld[I_Sel][J_Sel]].src;
      setTimeout("MoveAni("+ii+","+eval(jj+1)+")",100);
      return;
    }
  }
}

function GetMoveLine(ii, jj, nn)
{ if ((ii==I_Sel)&&(jj==J_Sel)) return(true);
  var vv=Fld[ii][jj];
  if (vv>0) return(false);
  if ((vv<0)&&(-nn<=vv)) return(0);
  vv=false;
  Fld[ii][jj]=-nn;
  if (ii>dSize) { if (GetMoveLine(ii-1, jj, nn+1)) vv=true; }
  if (ii<Size-1-dSize) { if (GetMoveLine(ii+1, jj, nn+1)) vv=true; }
  if (jj>dSize) { if (GetMoveLine(ii, jj-1, nn+1)) vv=true; }
  if (jj<Size-1-dSize) { if (GetMoveLine(ii, jj+1, nn+1)) vv=true; }
  return(vv);
}

function GetFld(ii, jj)
{ if (ii<dSize) return(0);
  if (ii>=Size-dSize) return(0);
  if (jj<dSize) return(0);
  if (jj>=Size-dSize) return(0);
  return(Fld[ii][jj]);
}

function RemoveTest(ii, jj) {
var ll, ss=0, ccount, ccol=Fld[ii][jj];
  ccount=1;
  ll=0;
  while (GetFld(ii+ll+1, jj)==ccol)
  { ll++;
    ccount++;
  }
  ll=0;
  while (GetFld(ii-ll-1, jj)==ccol)
  { ll++;
    ccount++;
  }
  if (ccount>=5)
  { Fld[ii][jj]=0;
    document.images[jj*Size+ii].src=Pic[0].src;
    ll=0;
    while (GetFld(ii+ll+1, jj)==ccol)
    { Fld[ii+ll+1][jj]=0;
      document.images[jj*Size+ii+ll+1].src=Pic[0].src;
      ll++;
    }
    ll=0;
    while (GetFld(ii-ll-1, jj)==ccol)
    { Fld[ii-ll-1][jj]=0;
      document.images[jj*Size+ii-ll-1].src=Pic[0].src;
      ll++;
    }
    ss+=ccount;
  }
  
  ccount=1;
  ll=0;
  while (GetFld(ii+ll+1, jj+ll+1)==ccol)
  { ll++;
    ccount++;
  }
  ll=0;
  while (GetFld(ii-ll-1, jj-ll-1)==ccol)
  { ll++;
    ccount++;
  }
  if (ccount>=5)
  { Fld[ii][jj]=0;
    document.images[jj*Size+ii].src=Pic[0].src;
    ll=0;
    while (GetFld(ii+ll+1, jj+ll+1)==ccol)
    { Fld[ii+ll+1][jj+ll+1]=0;
      document.images[(jj+ll+1)*Size+ii+ll+1].src=Pic[0].src;
      ll++;
    }
    ll=0;
    while (GetFld(ii-ll-1, jj-ll-1)==ccol)
    { Fld[ii-ll-1][jj-ll-1]=0;
      document.images[(jj-ll-1)*Size+ii-ll-1].src=Pic[0].src;
      ll++;
    }
    ss+=ccount; 
  }

  ccount=1;
  ll=0;
  while (GetFld(ii, jj+ll+1)==ccol)
  { ll++;
    ccount++;
  }
  ll=0;
  while (GetFld(ii, jj-ll-1)==ccol)
  { ll++;
    ccount++;
  }
  if (ccount>=5)
  { Fld[ii][jj]=0;
    document.images[jj*Size+ii].src=Pic[0].src;
    ll=0;
    while (GetFld(ii, jj+ll+1)==ccol)
    { Fld[ii][jj+ll+1]=0;
      document.images[(jj+ll+1)*Size+ii].src=Pic[0].src;
      ll++;
    }
    ll=0;
    while (GetFld(ii, jj-ll-1)==ccol)
    { Fld[ii][jj-ll-1]=0;
      document.images[(jj-ll-1)*Size+ii].src=Pic[0].src;
      ll++;
    }
    ss+=ccount; 
  }

  ccount=1;
  ll=0;
  while (GetFld(ii+ll+1, jj-ll-1)==ccol)
  { ll++;
    ccount++;
  }
  ll=0;
  while (GetFld(ii-ll-1, jj+ll+1)==ccol)
  { ll++;
    ccount++;
  }
  if (ccount>=5)
  { Fld[ii][jj]=0;
    document.images[jj*Size+ii].src=Pic[0].src;
    ll=0;
    while (GetFld(ii+ll+1, jj-ll-1)==ccol)
    { Fld[ii+ll+1][jj-ll-1]=0;
      document.images[(jj-ll-1)*Size+ii+ll+1].src=Pic[0].src;
      ll++;
    }
    ll=0;
    while (GetFld(ii-ll-1, jj+ll+1)==ccol)
    { Fld[ii-ll-1][jj+ll+1]=0;
      document.images[(jj+ll+1)*Size+ii-ll-1].src=Pic[0].src;
      ll++;
    }
    ss+=ccount; 
  }
  Score+=ss;
  document.forms[0].Score.value=Score;
  return(ss);
}