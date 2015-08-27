var I_Sel, J_Sel, I_Mov, J_Mov, N_Flds;
var Move, IsOver;
var Size=9;
var FldSize=4;

var totMoves=0;
var nickname="Human";

IsPlayer=new Array(2);
IsPlayer[0]=true;
IsPlayer[1]=false;
Fld = new Array(Size);
for (i=0; i < Size; i++) { Fld[i]=new Array(Size); }
Pic= new Array(6);
for (i=0; i<6; i++) { Pic[i] = new Image(); Pic[i].src = "img/xgn"+i+".gif"; }

function startGame() {
var ii, jj, dd;
  for (jj=0; jj<Size; jj++)
  { for (ii=0; ii<Size; ii++)
    { dd=Distance(ii-4, jj-4);
      if (dd>4) Fld[ii][jj]=5;
      else
      { if (dd>FldSize) Fld[ii][jj]=4;
        else Fld[ii][jj]=-1;
      }  
    }
  }
  Fld[4][4-FldSize]=0;
  Fld[4+FldSize][4-FldSize]=1;
  Fld[4-FldSize][4]=1;
  Fld[4+FldSize][4]=0;  
  Fld[4-FldSize][4+FldSize]=0;
  Fld[4][4+FldSize]=1;
  if (FldSize*Math.random()<1) Fld[4][4]=4;
  if (FldSize*Math.random()<1)
  { if (2*Math.random()<1) { Fld[5][4]=4; Fld[3][5]=4; Fld[4][3]=4; }
    else { Fld[4][5]=4; Fld[5][3]=4; Fld[3][4]=4; }
  } 
  if ((FldSize==4)&&(2*Math.random()>1))
  { if (2*Math.random()>1) { Fld[6][4]=4; Fld[2][6]=4; Fld[4][2]=4; }
    else { Fld[4][6]=4; Fld[6][2]=4; Fld[2][4]=4; }
  }  
  N_Flds=0;
  for (ii=0; ii<Size; ii++)
  { for (jj=0; jj<Size; jj++)
    { if (Fld[ii][jj]<2) N_Flds++;
    }
  }          
  I_Sel=-1;
  J_Sel=-1;
  I_Mov=-1;
  J_Mov=-1;
  IsOver=0;
  Move=parseInt(Math.random()*2);
  totMoves=0;
  showInfo();
  document.getElementById("winDiv").style.display="none";
  if (IsPlayer[Move]==false) { document.getElementById("turnDiv").innerHTML="NPC"; } else { document.getElementById("turnDiv").innerHTML=nickname; }
  RefreshScreen();
}

function Timer() { if (IsOver) return;
  if (IsPlayer[Move]) return;
  if (I_Mov<0) 
  { GetBestMove(Move,2);
    I_Mov+=I_Sel;
    J_Mov+=J_Sel;
    RefreshPic(I_Sel, J_Sel);
  }  
  else MoveTo(I_Mov, J_Mov, Move, true);
}

function GetBestMove(mmove, ll)
{ var ii, jj, dd_i, dd_j, nn, mm, vv, ii_s, jj_s, ii_m, jj_m, vv_best=-10000;
  var mm1=1-mmove, ll1=ll-1, ss, dd_s, cc=mmove, dd=4-FldSize;
  for (ii=dd; ii<Size-dd; ii++)
  { for (jj=dd; jj<Size-dd; jj++)
    { if (Fld[ii][jj]==cc)
      { for (dd_i=-2; dd_i<=2; dd_i++)
        { for (dd_j=-2; dd_j<=2; dd_j++)
          { if ((dd_i*dd_j<=1)&&(GetFld(ii+dd_i, jj+dd_j)==-1))
            { Fld[ii+dd_i][jj+dd_j]=cc;
              if (Distance(dd_i,dd_j)==2)
                Fld[ii][jj]=-1;
              dd_s=1;
              ss=0;
              for (nn=-1; nn<=1; nn++)
              { for (mm=-1; mm<=1; mm++)
                { if (nn!=mm)
                  { if (GetFld(ii+dd_i+nn, jj+dd_j+mm)==1-cc)
                    { ss+=dd_s;
                      Fld[ii+dd_i+nn][jj+dd_j+mm]=cc;
                    }
                    dd_s*=2;
                  }  
                }
              }
              if (ll>1) vv=-GetBestMove(mm1, ll1);
              else
              { vv=0;
                for (nn=0; nn<Size; nn++)
                { for (mm=0; mm<Size; mm++)
                  { if (Fld[nn][mm]==cc) vv++;
                    if (Fld[nn][mm]==1-cc) vv--;
                  }
                }   
                vv+=Math.random();
              }  
              if (vv_best<vv)
              { vv_best=vv;
                ii_s=ii;
                jj_s=jj;
                ii_m=dd_i;
                jj_m=dd_j;
              }
              dd_s=1;
              for (nn=-1; nn<=1; nn++)
              { for (mm=-1; mm<=1; mm++)
                { if (nn!=mm)
                  { if ((ss & dd_s)==dd_s)
                      Fld[ii+dd_i+nn][jj+dd_j+mm]=1-cc;
                    dd_s*=2;
                  }  
                }
              }   
              Fld[ii][jj]=mmove;
              Fld[ii+dd_i][jj+dd_j]=-1;
            }            
          }
        }
      }
    }
  }
  I_Sel=ii_s;
  J_Sel=jj_s;
  I_Mov=ii_m;
  J_Mov=jj_m;
  return(vv_best);
}

function MoveTo(ii, jj, mmove, vv) {
  var nn, mm, ss=0;
  if (Distance(ii-I_Sel, jj-J_Sel)>1)
    Fld[I_Sel][J_Sel]=-1;
  nn=I_Sel; mm=J_Sel; I_Sel=-1; J_Sel=-1;
  if (vv) RefreshPic(nn, mm);
  Fld[ii][jj]=1-mmove;
  if (vv) RefreshPic(ii, jj);
  for (nn=-1; nn<=1; nn++)
  { for (mm=-1; mm<=1; mm++)
    { if ((nn*mm!=1)&&(GetFld(ii+nn,jj+mm)==1-mmove))
      { Fld[ii+nn][jj+mm]=mmove;
        if (vv) RefreshPic(ii+nn, jj+mm);
        ss++;
      }
    }
  }
  I_Sel=-1;
  J_Sel=-1;
  I_Mov=-1;
  J_Mov=-1;
  
  totMoves++;
  showInfo();
  if (IsPlayer[Move]) { document.getElementById("turnDiv").innerHTML="NPC"; } else { document.getElementById("turnDiv").innerHTML=nickname; }
  
  if (vv) OverTest(mmove);
  Move=1-Move;
  return(ss);
}

function showInfo() {
  document.getElementById("movesDiv").innerHTML=""+totMoves;
}


function ImgNum(vvi,vvj)
{ var ii, jj, nn=0;
  for (jj=0; jj < Size; jj++)
  { for (ii=0; ii < Size; ii++)
    { if ((ii==vvi)&&(jj==vvj)) return(nn);
      if (Fld[ii][jj]<5) nn++;
    }
  }
  return(0);
}

function GetFld(nn, mm)
{ if (nn<0) return(-2);
  if (nn>=Size) return(-2);
  if (mm<0) return(-2);
  if (mm>=Size) return(-2);
  return(Fld[nn][mm]);
}

function OverTest(mmove) {
var ii, jj, nn, mm, ss=0;
  IsOver=false;
  for (ii=0; ii<Size; ii++)
  { for (jj=0; jj<Size; jj++)
    { if (Fld[ii][jj]==1-mmove)
      { ss++;
        for (nn=-2; nn<=2; nn++)
        { for (mm=-2; mm<=2; mm++)
          { if ((nn*mm<=1)&&(GetFld(ii+nn,jj+mm)==-1))
              return(false);
          }
        }
      }
    }
  }
  IsOver=true;
  if (2*ss<N_Flds) {
   if (mmove==0) {
   	document.getElementById("winDiv").innerHTML="<br><b>"+nickname+" has won</b>!";
   	document.getElementById("winDiv").style.display="block";
   	document.getElementById("turnDiv").innerHTML="";
    updateScore(9999999);
   } else {
   	document.getElementById("winDiv").innerHTML="<br><b>NPC has won</b>!";
   	document.getElementById("winDiv").style.display="block";
   	document.getElementById("turnDiv").innerHTML="";
   }
  } else if (2*ss>N_Flds) {
   if (mmove==0) {
   	document.getElementById("winDiv").innerHTML="<br><b>NPC has won</b>!";
   	document.getElementById("winDiv").style.display="block";
   	document.getElementById("turnDiv").innerHTML="";
   } else {
   	document.getElementById("winDiv").innerHTML="<br><b>"+nickname+" has won</b>!";
   	document.getElementById("winDiv").display="block";
   	document.getElementById("turnDiv").innerHTML="";
    updateScore(9999999);
   }
  } else if (2*ss==N_Flds) {
  	document.getElementById("winDiv").innerHTML="<br><b>It's a tie</b>...";
  	document.getElementById("winDiv").style.display="block";
  	document.getElementById("turnDiv").innerHTML="";
  } else {}
  return(true);
}

function MouseDown(ii, jj)
{ if (IsOver) return;
  if (! IsPlayer[Move]) return;
  if (I_Sel<0)
  { if (GetFld(ii,jj)!=Move) return;
    I_Sel=ii; J_Sel=jj;
    RefreshPic(ii, jj);
    return;
  }
  if ((ii==I_Sel)&&(jj==J_Sel))
  { I_Sel=-1; 
    J_Sel=-1;
    RefreshPic(ii, jj);
    return;
  }
  if (GetFld(ii,jj)!=-1) return;
  if (Distance(ii-I_Sel,jj-J_Sel)>2) return;
  MoveTo(ii, jj, Move, true);  
} 

function Distance(ddi, ddj)
{ if (ddi*ddj<0)
  { if (Math.abs(ddi)>Math.abs(ddj)) return(Math.abs(ddi));
    return(Math.abs(ddj));
  }
  return(Math.abs(ddi)+Math.abs(ddj));
}

function RefreshPic(ii, jj) {
  if ((ii==I_Sel)&&(jj==J_Sel)) {
    document.images[ImgNum(ii,jj)].src = Pic[Fld[ii][jj]+3].src;
  } else {
    document.images[ImgNum(ii,jj)].src = Pic[Fld[ii][jj]+1].src;
  }
}

function RefreshScreen()
{ var ii, jj, nn=0;
  for (jj=0; jj < Size; jj++)
  { for (ii=0; ii < Size; ii++)
    { if (Fld[ii][jj]<5)
        document.images[nn++].src=Pic[Fld[ii][jj]+1].src;
    }
  }
}

startGame();
setInterval('Timer()',500);