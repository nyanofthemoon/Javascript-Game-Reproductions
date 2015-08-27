var ship=0;
var running=0;
var nextThump=0;
var thumpTimer=1;
var isExplorer=0;
var maxX=650;
var maxY=350;
var updateSpeed;
var maxasteroidSpeed=10;
var asteroids=new Array();
var maxCurrentasteroids=3;
var asteroidCount=0;
var asteroidRegenTimer=0;
var maxStartasteroids=14;
var maxEverasteroids=maxStartasteroids*7;
var remainingasteroids;
var shipIdx=new Array(16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17);
var maxShipBullets=5;
var maxShipAngles=32;
var maxAccel=0.2;
var maxShipSpeed=25;
var maxShipBulletShotLength=25;
var maxShipBulletSpeed=7;
var maxExplosions=3;
var maxParticlesPerExplosion=4;
var maxParticleLife=10;
var maxExpParticleSpeed=6;
var explosions= new Array();
var score;
var bigasteroidWidth=95;
var bigasteroidHeight=95;
var gameSpeed=0;
var gameSpeedTimer=0;
var startButtonDelay=0;
var bshipvar=0;
var bonusShipBulletSpeed=15;
var bShipBullet=0;
var timeSinceLastHit=0;
var gameLength=0;
var bonusShipSpeed=5;
var maxShipShield=100;
var shipShield=100;
var selectedShip=0;
var lastSelectedShip=0;
var damRatio=2;
var imgUrl="img/";
var turnRatio=0;
var turnSpeed=2;

isExplorer=navigator.appName.indexOf("Microsoft")!=-1;
bShipNames=new Array(imgUrl+"ship_a.gif",imgUrl+"ship_b.gif");
document.bShipImages=new Array();
for (index=0; index<2; index++) { document.bShipImages[index]=new Image; document.bShipImages[index].src=bShipNames[index]; }
document.bullet = new Image;
document.bullet.src=imgUrl+"fire.gif";
document.startbutton=new Image();
document.startbutton.src=imgUrl+"start.gif";
document.shipImages = new Array();
document.asteroid0=new Image; document.asteroid0.src=imgUrl+"ast_s.gif";
document.asteroid1=new Image; document.asteroid1.src=imgUrl+"ast_m.gif";
document.asteroid2=new Image; document.asteroid2.src=imgUrl+"ast_l.gif";


function selShip(d) {
	selectedShip=d;
	if (d==0) {				// AVERAGIE
		maxShipBullets=5;
		maxShipBulletShotLength=25;
		maxShipSpeed=25;
		maxAccel=0.2;
		shipShield=100;
		maxShipShield=100;
		damRatio=2;
		maxShipBulletSpeed=7;
		turnSpeed=2;
	} else if (d==1) {		// TOUGHIE
		maxShipBullets=7;
		maxShipBulletShotLength=25;
		maxShipSpeed=15;
		maxAccel=0.08;
		shipShield=100;
		maxShipShield=100;
		damRatio=1;
		maxShipBulletSpeed=7;
		turnSpeed=4;
	} else {				// SPEEDY
		maxShipBullets=3;
		maxShipBulletShotLength=20;
		maxShipSpeed=30;
		maxAccel=0.5;
		shipShield=50;
		maxShipShield=50;
		damRatio=3;
		maxShipBulletSpeed=7;
		turnSpeed=1;
	}
	document.getElementById("ship0").style.background="#000000";
	document.getElementById("ship1").style.background="#000000";
	document.getElementById("ship2").style.background="#000000";
	document.getElementById("ship"+d).style.background="#FFFFFF";
}

function BonusShipBullet_Shoot(sxpos,sypos,width,height,accuracy) {
	var theta;
	var xpos,ypos;
	xpos=ship.xpos+ship.width/2;
	ypos=ship.ypos+ship.height/2;

	if(this.ypos==ship.ypos)
	{
		if(xpos>this.xpos)
			theta=0;
		else
			theta=Math.PI;
	}
	else
		theta=Math.atan(Math.abs((xpos-this.xpos))/Math.abs((ypos-this.ypos)));

	if(accuracy<Math.random())
	{
		theta+=Math.PI/4*(0.8-(Math.random()+0.3));
		if(theta>Math.PI/2)
			theta=Math.PI/2;

		if(theta<0)
			theta=0;
	}


	this.xinc=Math.sin(theta)*bonusShipBulletSpeed;
	this.yinc=Math.cos(theta)*bonusShipBulletSpeed;

	if(xpos<this.xpos)
		this.xinc*=-1;

	if(ypos<this.ypos)
		this.yinc*=-1;


	this.xpos=this.fxpos=this.bel.style.top=sxpos+Math.round(width/2);
	this.ypos=this.fypos=this.bel.style.left=sypos+Math.round(height/2);
	this.bel.style.display="block";
	this.length=20;

}

function BonusShipBullet_Move() {

	this.fxpos+=this.xinc;
	this.fypos+=this.yinc;

	if(this.fxpos<0)
		this.fxpos=maxX;
	if(this.fxpos>maxX)
		this.fxpos=0;

	if(this.fypos<0)
		this.fypos=maxY;
	if(this.fypos>maxY)
		this.fypos=0;

	this.xpos=Math.round(this.fxpos);
	this.ypos=Math.round(this.fypos);
	this.bel.style.top=this.ypos;
	this.bel.style.left=this.xpos;
	this.length--;
	if(this.length<=0 || CheckAsteroidCollision(this.xpos,this.ypos,0))
	{
		this.Kill();
		return 1;
	}
	if(ship!=0)
	{
		var sx1,sx2sy1,sy2;
		sx1=ship.xpos+(ship.width/3);
		sx2=ship.xpos+(ship.width/(3/2));
		sy1=ship.ypos+(ship.height/3);
		sy2=ship.ypos+(ship.height/(3/2));
		if(this.xpos>=sx1 && this.xpos<=sx2)
			if(this.ypos>=sy1 && this.ypos<=sy2)
			{
				ship.Die();
				this.Kill();
				return 1;
			}
	}
	return 0;
}


function BonusShipBullet_Kill() { this.bel.style.display="none"; }

function BonusShipBullet(sxpos,sypos,width,height,accuracy)
{

	this.xpos=this.fxpos=sxpos+(width/2);
	this.ypos=this.fypos=sypos+(height/2);
	this.xinc=this.yinc=0;
	this.bel=document.getElementById('BSBulletDiv');
	this.length=0;
	this.Move=BonusShipBullet_Move;
	this.Kill=BonusShipBullet_Kill;
	this.Shoot=BonusShipBullet_Shoot;
	this.Shoot(sxpos,sypos,width,height,accuracy);

}


function BonusShip_Move() {
	var i;
	this.fxpos+=this.xinc;
	if(this.fxpos<-this.width)
		this.fxpos=maxX;
	if(this.fxpos>maxX)
		this.fxpos=-this.width;

	this.fypos+=this.yinc;
	if(this.fypos<-this.height)
		this.fypos=maxY;
	if(this.fypos>maxY)
		this.fypos=-this.height;

	this.ypos=Math.round(this.fypos);
	this.xpos=Math.round(this.fxpos);
	this.divEl.style.top=this.ypos;
	this.divEl.style.left=this.xpos;
	if(this.length!=0)
		this.length--;
	else
		this.SetDestAndLength();


	if(bShipBullet==0 && ship!=0)
		if(!ship.hit && !ship.dead)
			bShipBullet=new BonusShipBullet(this.xpos,this.ypos,this.width,this.height,this.accuracy);

	if(ship!=0)
	{
		for(i=0; i<3; i++)
		{
			var xpos=ship.xpos+ship.width/2+ship.points[i];

			if(xpos>this.xpos && xpos<this.xpos+this.width)
			{
				var ypos=ship.ypos+ship.height/2 +ship.points[i+1];
				if(ypos>this.ypos && ypos<this.ypos+this.height)
				{
					ship.Die();
					return 1;
				}
			}
		}
	}
	return 0;
}

function BonusShip_Kill() {

	this.divEl.style.display="none";

}


function BonusShip_SetDestAndLength() {
	if(this.xdir<=0)
	{
		angle=0.5*Math.random()*Math.PI+(Math.PI/2);
	}
	else
	{
		if(Math.random()<0.5)
			angle=0.25*Math.random()*(Math.PI/2);
		else
			angle=0.25*Math.random()*(Math.PI/2)+((2*Math.PI)/3);
	}
	this.length=Math.round(40*Math.random())+10;
	this.xinc=this.maxBShipSpeed*Math.sin(angle)*this.xdir;
	this.yinc=this.maxBShipSpeed*Math.cos(angle)*this.ydir;

}



function BonusShip(type) {

	var el = document.getElementById('BSDiv');
	this.divEl=el;
	this.srcID="BSSrc";

	if(type==0)
	{
		this.width=50;
		this.height=28;
		this.maxBShipSpeed=bonusShipSpeed;
		this.accuracy=0.1;
		this.award=500;
	}
	else
	{
		this.width=26;
		this.height=14;
		this.maxBShipSpeed=bonusShipSpeed*1.2;
		this.accuracy=0.2;
		this.award=1000;
	}
	document.images[this.srcID].src=document.bShipImages[type].src;


	this.SetDestAndLength=BonusShip_SetDestAndLength;
	this.Move=BonusShip_Move;
	this.Kill=BonusShip_Kill;

	if(Math.random()<0.5)
	{
		this.xpos=-(this.width-5);
		this.xdir=1;

	}
	else
	{
		this.xpos=maxX-5;
		this.xdir=-1;
	}

	if(Math.random()<0.5)
	{
		this.ypos=-(this.height-5);
		this.ydir=1;
	}
	else
	{
		this.ypos=this.height+5;
		this.ydir=-1;
	}

	this.fxpos=this.xpos;
	this.fypos=this.ypos;
	this.divEl.style.width=this.width;
	this.divEl.style.height=this.height;
	this.SetDestAndLength();
	this.divEl.style.display="block";
	this.bxinc=0;
	this.byinc=0;
	this.bxpos=0;
	this.bypos=0;
	this.bfxpos=0;
	this.bfypos=0;
	this.shooting=0;
	this.bel=document.getElementById('BSBulletDiv');
}

function WriteBonusHTML() {
	var HTML;
	HTML="<div id='BSDiv' style='position:absolute; width:0; height:0; top:0; left:0; display:none'><img id='BSSrc' src='"+imgUrl+"ship_a.gif'></div>";
	HTML+="<div id='BSBulletDiv' style='position:absolute ; display:none; top:0; left:0; width:2; height:2'><img width='2' height='2' src='"+imgUrl+"fire.gif'></div>";
	document.write(HTML);
	document.close();
}


function AddNewAsteroid(xpos,ypos,type) {
	var i;
	for(i=0; i<maxEverasteroids; i++)
	{
		if(asteroids[i]==0)
		{
			asteroids[i]=new asteroid(xpos,ypos,i,type);
			break;
		}
	}
}

function CheckAsteroidCollision(xpos,ypos,addScore) {
	var i;
	for(i=0; i<maxEverasteroids; i++)
	{
		if(asteroids[i])
		{
			if(xpos>asteroids[i].xpos && xpos<asteroids[i].xpos+asteroids[i].width) {
				if (ypos > asteroids[i].ypos && ypos < asteroids[i].ypos + asteroids[i].height) {
					var xpos, ypos, type;

					asteroids[i].Kill();

					xpos = asteroids[i].fxpos;
					ypos = asteroids[i].fypos;
					type = asteroids[i].type;
					AddNewExplosion(xpos, ypos, asteroids[i].width, asteroids[i].height);
					if (addScore)
						score.AddScore(asteroids[i].award);

					delete asteroids[i];
					asteroids[i] = 0;

					if (type) {
						type--;
						AddNewAsteroid(xpos, ypos, type);
						AddNewAsteroid(xpos, ypos, type);
					}

					return 1;
				}
			}
		}
	}
	return 0;
}

function AddNewExplosion(xpos,ypos,width,height)
{
	var i;
	for(i=0; i <maxExplosions; i++)
	{
		if(explosions[i]==0)
		{
			explosions[i]=new Explosion(xpos+(width/2),ypos+(height/2),i);
			break;
		}
	}
}

function Particle_Move() {
	var el=document.getElementById(this.divid);
	this.fxpos+=this.xspeed;
	this.fypos+=this.yspeed;
	el.style.top=Math.round(this.fypos);
	el.style.left=Math.round(this.fxpos);
	this.xspeed*=this.decel;
	this.yspeed*=this.decel;
	this.life--;
	if(!this.life) {
		return 1;
	}
	return 0;
}

function Particle_Kill() {
	var el=document.getElementById(this.divid);
	el.style.display="none";
}



function Particle(xpos,ypos,id)
{
	var el;
	var expSpeed=maxExpParticleSpeed*(0.5+(0.5*Math.random()));
	var angle=Math.random()*2*Math.PI;
	this.xinc=Math.sin(angle);
	this.xspeed=this.xinc*expSpeed;
	this.yinc=Math.cos(angle)*expSpeed;
	this.yspeed=this.yinc*expSpeed;
	this.xpos=this.fxpos=xpos;
	this.ypos=this.fypos=ypos;
	this.decel=0.86;
	this.divid="ExpParticle"+id;
	this.Kill=Particle_Kill;
	this.life=Math.round(maxParticleLife*(0.5+(0.5*Math.random())));
	this.Move=Particle_Move;
	el=document.getElementById(this.divid);
	el.style.top=this.ypos;
	el.style.left=this.xpos;
	el.style.display="block";

	document.images[this.divid+"Img"].src=document.bullet.src;
}


function Explosion_Move() {
	var i;
	for(i=0; i<maxParticlesPerExplosion; i++)
	{
		if(this.particles[i])
		{
			if(this.particles[i].Move())
			{
				this.particles[i].Kill();
				delete this.particles[i];
				this.particles[i]=0;
				this.activeParticles--;
			}
		}
	}
	if(this.activeParticles==0) {
		return 1;
	}

	return 0;
}

function Explosion_Kill() {
	var i;
	for (i=0; i<maxParticlesPerExplosion; i++)
	{
		if(this.particles[i]!=0)
		{
			this.particles[i].Kill();
			delete this.particles[i];
			this.particles[i]=0;
		}
	}
}

function Explosion(xpos,ypos,id) {
	var i;
	this.xpos=xpos;
	this.ypos=ypos;
	this.id=id;
	this.particles=new Array;
	for(i=0; i< maxParticlesPerExplosion; i++)
	{
		this.particles[i]=new Particle(xpos,ypos,(id*maxParticlesPerExplosion)+i);
	}
	this.activeParticles=maxParticlesPerExplosion;
	this.Move=Explosion_Move;
	this.Kill=Explosion_Kill;
}


function ProcessExplosions() {
	var i;
	for(i=0; i<maxExplosions; i++)
	{
		if(explosions[i])
		{
			if(explosions[i].Move())
			{

				delete explosions[i];
				explosions[i]=0;
			}
		}
	}
}


function ShipBullet_Kill() {
	var el=document.getElementById(this.id);
	el.style.display="none";
}


function ShipBullet_Move() {
	var el;

	if(this.life)
	{

		this.life--;
		this.fxpos+=this.xinc;
		this.fypos+=this.yinc;

		if(this.fxpos<0) {
			this.fxpos = maxX;
		}
		if(this.fxpos>maxX) {
			this.fxpos = 0;
		}
		if(this.fypos<0) {
			this.fypos = maxY;
		}
		if(this.fypos>maxY) {
			this.fypos = 0;
		}

		this.xpos=Math.round(this.fxpos);
		this.ypos=Math.round(this.fypos);

		el=document.getElementById(this.id);
		el.style.top=this.ypos;
		el.style.left=this.xpos;
		if(CheckAsteroidCollision(this.xpos,this.ypos,1))
		{
			timeSinceLastHit=0;
			this.Kill();
			return 1;
		}

	}
	else
	{
		this.Kill();
		return 1;
	}

	if(bshipvar !=0)
	{

		if(this.xpos>bshipvar.xpos && this.xpos<(bshipvar.xpos+bshipvar.width)) {
			if (this.ypos > bshipvar.ypos && this.ypos < (bshipvar.ypos + bshipvar.height)) {

				this.Kill();
				score.AddScore(bshipvar.award);
				AddNewExplosion(bshipvar.xpos, bshipvar.ypos, bshipvar.width, bshipvar.height);
				timeSinceLastHit = 0;
				bshipvar.Kill();
				delete bshipvar;
				bshipvar = 0;
				return 1;
			}
		}
	}
	return 0;

}


function ShipBullet(xpos,ypos,angle,id) {
	var el;
	var radAngle;

	this.fxpos=this.xpos=Math.round(xpos);
	this.fypos=this.ypos=Math.round(ypos)
	radAngle=(angle/maxShipAngles)*2*Math.PI;
	this.xinc=Math.sin(radAngle)*maxShipBulletSpeed;
	this.yinc=Math.cos(radAngle)*maxShipBulletSpeed;
	this.id="shipbull"+id;
	this.Kill=ShipBullet_Kill;
	this.Move=ShipBullet_Move;
	this.life=maxShipBulletShotLength;
	el=document.getElementById(this.id);
	el.style.left=this.xpos;
	el.style.top=this.ypos;
	el.style.display="block";

}


function Ship_ShowLives() {
	var i;

	for(i=0; i<this.maxLives; i++)
	{

		var lifeName="life"+i;
		var el=document.getElementById(lifeName);
		if(i<this.lives)
		{
			console.log(lifeName);
			document.images[lifeName].src=document.shipImages[16].src;
			el.style.display="block";
		}
		else {
			el.style.display = "none";
		}

	}
}


function Ship_Move() {
	var  i;

	if(this.hit || this.dead) {
		return;
	}

	if(this.fxpos>maxX) {
		this.fxpos = 0;
	}
	else {
		if (this.fxpos + this.width < 0) {
			this.fxpos = maxX;
		}
	}

	if(this.fypos>maxY) {
		this.fypos = 0;
	} else {
		if(this.fypos+this.height<0) {
			this.fypos = maxY;
		}
	}

	if(this.thrusting) {
		this.Thrust();
	}

	if(this.angleDir) {
		this.Rotate(this.angleDir);
	}

	this.fxpos+=this.xspeed;
	this.fypos+=this.yspeed;
	this.xpos=Math.round(this.fxpos);
	this.ypos=Math.round(this.fypos);

	this.el.style.left=this.xpos;
	this.el.style.top=this.ypos;

	for(i=0; i<maxShipBullets; i++)
		if(this.Bullets[i]!=0)
		{
			if(this.Bullets[i].Move())
			{
				delete this.Bullets[i];
				this.Bullets[i]=0;
			}
		}
	this.CheckAsteroidCollision();

}

function Ship_KillAllShipBullets() {
	var i;
	for(i=0; i<maxShipBullets; i++)
	{
		if(this.Bullets[i]!=0)
		{
			this.Bullets[i].Kill();
			delete this.Bullets[i];
			this.Bullets[i]=0;
		}
	}
}

function Ship_CheckAsteroidCollision() {
	var i,j;

	for(i=0; i<maxEverasteroids; i++)
	{
		if(asteroids[i])
		{

			for(j=0; j<6; j+=2)
			{

				var xpos=this.xpos+this.width/2+this.points[j];
				var ypos=this.ypos+this.height/2 +this.points[j+1];

				if(xpos>asteroids[i].xpos+asteroids[i].wd && xpos<asteroids[i].xpos+asteroids[i].width-asteroids[i].wd) {
					if (ypos > asteroids[i].ypos + asteroids[i].hd && ypos < asteroids[i].ypos + asteroids[i].height - asteroids[i].hd) {

						this.Die();


					}
				}
			}
		}
	}
}

function Ship_Die() {
	if(this.hit) { return; } else {

		shipShield=shipShield-damRatio;
		AddNewExplosion(this.xpos,this.ypos,this.width,this.height);

		if (shipShield<1) {
			this.hit=1;
			var i;
			this.lives--;
			if(this.lives==0)
				this.dead=1;
			this.el.style.display="none";
			for(i= 0;i<maxExplosions; i++)
			{
				if(explosions[i]!=0)
				{
					explosions[i].Kill();
					delete explosions[i];
					explosions[i]=0;
				}
				AddNewExplosion(this.xpos,this.ypos,this.width,this.height);
			}
			this.KillAllShipBullets();
			this.regenDelay=40;
			this.ShowLives();
			shipShield=maxShipShield;

		} else {
			AddNewExplosion(this.xpos,this.ypos,this.width,this.height);
			this.regenDelay=300;
			this.hit=0;
		}
		updateShield();
	}
}


function Ship_NextLife() {

	if(this.dead!=0 || this.hit==0) {
		return;
	}

	if(this.regenDelay)
	{
		this.regenDelay--;
		return;
	}

	var i;
	var crx,cry;
	var shipXOffset=this.width*3;
	var shipYOffset=this.height*3;
	var sx=maxX/2;
	var sy=maxY/2;

	if(bshipvar)
	{
		bshipvar.Kill();
		delete bshipvar;
		bshipvar=0;
	}

	for(i=0; i<maxEverasteroids; i++)
	{
		if(asteroids[i]!=0)
		{
			crx=asteroids[i].xpos+(asteroids[i].width/2);
			cry=asteroids[i].ypos+(asteroids[i].height/2);
			if(crx>=sx-shipXOffset && crx<=sx+shipXOffset) {
				if (cry >= sy - shipYOffset && cry <= sy + shipYOffset) {
					return 0;
				}
			}
		}
	}
	timeSinceLastHit=0;
	this.Restore();
	return;
}

function Ship_Restore() {
	this.angle=0;
	this.angleDir=0;
	this.xpos=this.fxpos=this.startX;
	this.ypos=this.fypos=this.startY;
	this.xspeed=0;
	this.yspeed=0;
	this.shooting=0;
	this.xinc=0;
	this.yinc=0;
	this.thrusting=0;
	this.hit=0;
	this.bulletshotlength=maxShipBulletShotLength;
	for(i=0; i<maxShipBullets; i++) {
		this.Bullets[i] = 0;
	}

	this.el.style.width=this.width;
	this.el.style.height=this.height;
	this.el.style.top=this.startY;
	this.el.style.left=this.startX;
	this.nomore=0;
	this.Rotate(this.angle);

	document.images['playerpic'].src=document.shipImages[this.angle].src
	this.el.style.display="block";
}


function Ship_Shoot() {
	var i;
	if(this.shooting || this.dead || this.hit) {
		return;
	}
	this.shooting=1;
	for(i=0; i<maxShipBullets; i++) {
		if (this.Bullets[i] == 0) {
			this.Bullets[i] = new ShipBullet(Math.round(this.xpos + (this.width / 2)), Math.round(this.ypos + (this.height / 2)), this.angle, i);
			break;
		}
	}


}

function Ship_Rotate(dir) {

	turnRatio++;
	if (turnRatio<turnSpeed) {} else {
		turnRatio=0;


		var radAngle,i;

		this.angle+=dir;
		if(this.angle>=maxShipAngles) {
			this.angle = 0;
		}

		if(this.angle<0) {
			this.angle = maxShipAngles - 1;
		}

		radAngle=(this.angle/maxShipAngles)*2*Math.PI;

		this.xinc=Math.sin(radAngle)*this.accel;
		this.yinc=Math.cos(radAngle)*this.accel;
		document.images['playerpic'].src=document.shipImages[this.angle].src

		this.points[0]=13*Math.sin(radAngle);
		this.points[1]=13*Math.cos(radAngle);

		radAngle=(this.angle/maxShipAngles)*2*Math.PI;
		radAngle+=(106.7/360)*2*Math.PI;
		this.points[2]=Math.round(9*Math.sin(radAngle));
		this.points[3]=Math.round(9*Math.cos(radAngle));

		radAngle+=(146.6/360)*2*Math.PI;
		this.points[4]=Math.round(9*Math.sin(radAngle));
		this.points[5]=Math.round(9*Math.cos(radAngle));
	}

	return;

}

function Ship_Thrust() {

	if(Math.abs(this.xspeed)>=maxShipSpeed || Math.abs(this.yspeed)>=maxShipSpeed) {
		return;
	}
	this.xspeed+=this.xinc;
	this.yspeed+=this.yinc;

}

function Ship_Hyperspace() {
	this.xpos=this.fxpos=Math.round(Math.random()*(maxX-40)+20);
	this.ypos=this.fypos=Math.round(Math.random()*(maxY-40)+20);
}


function Ship(startX,startY) {
	var i,el;
	this.angle=0;
	this.angleDir=0;
	this.startX=this.xpos=this.fxpos=startX;
	this.startY=this.ypos=this.fypos=startY;
	this.xspeed=0;
	this.yspeed=0;
	this.shooting=0;
	this.xinc=0;
	this.yinc=0;
	this.width=42;
	this.height=42;
	this.thrusting=0;
	this.accel=maxAccel;
	this.hit=0;
	this.dead=0;
	this.bulletshotlength=maxShipBulletShotLength;
	this.Bullets = new Array();
	for(i=0; i<maxShipBullets; i++) {
		this.Bullets[i] = 0;
	}
	this.Thrust=Ship_Thrust;
	this.Rotate=Ship_Rotate;
	this.Shoot=Ship_Shoot;
	this.Move=Ship_Move;
	this.Die=Ship_Die;
	this.Restore=Ship_Restore;
	this.CheckAsteroidCollision=Ship_CheckAsteroidCollision;
	this.ShowLives=Ship_ShowLives;
	this.Hyperspace=Ship_Hyperspace;
	this.el=document.getElementById('playership');
	this.el.style.display="block";
	this.el.style.width=this.width;
	this.el.style.height=this.height;
	this.el.style.top=startY;
	this.el.style.left=startX;
	this.points=new Array(0,0,0,0,0,0);
	this.nomore=0;
	this.Rotate(this.angle);
	this.lives=3;
	this.maxLives=3;
	this.regenDelay=0;
	this.NextLife=Ship_NextLife;
	this.KillAllShipBullets=Ship_KillAllShipBullets;
	this.bonusLife=0;
	document.images['playerpic'].src=document.shipImages[this.angle].src
	this.ShowLives();

}


function asteroid_Move() {
	this.fxpos+=this.xspeed;
	if(this.fxpos+this.width<0) {
		this.fxpos = maxX;
	}
	if(this.fxpos>maxX) {
		this.fxpos = -this.width;
	}

	this.fypos+=this.yspeed;
	if(this.fypos+this.height<0) {
		this.fypos = maxY;
	}

	if(this.fypos>maxY) {
		this.fypos = (-this.height * 1);
	}


	this.xpos=Math.round(this.fxpos) ;
	this.ypos= Math.round(this.fypos);

	this.el.style.left=this.xpos;;
	this.el.style.top=this.ypos;

}



function asteroid_Kill() {
	this.el.style.display="none";
	asteroidCount--;
	remainingasteroids--;
}




function asteroid(xpos,ypos,id,type) {
	var maxspeed;
	var asteroidID="asteroidimg"+id;

	asteroidCount++;

	this.divid="asteroid"+id;
	this.Kill=asteroid_Kill;
	this.Move=asteroid_Move;
	this.fxpos=this.xpos=xpos;
	this.fypos=this.ypos=ypos;

	if(type==2)
	{
		this.width=bigasteroidWidth;
		this.height=bigasteroidHeight;
		maxspeed=0.4*maxasteroidSpeed*(0.5+(0.5*Math.random()));
		document.images[asteroidID].src=document.asteroid2.src;
		this.award=20;
	}
	if(type==1)
	{
		this.width=50;
		this.height=40;
		maxspeed=0.6*maxasteroidSpeed*(0.6+(0.4*Math.random()));
		document.images[asteroidID].src=document.asteroid1.src;
		this.award=50;
	}

	if(type==0)
	{
		this.width=25;
		this.height=20;
		this.award=100;
		maxspeed=maxasteroidSpeed*(0.7+(0.3*Math.random()));
		document.images[asteroidID].src=document.asteroid0.src;
	}

	this.el=document.getElementById(this.divid);
	this.el.style.width=this.width;
	this.el.style.height=this.height;
	this.el.style.top=ypos;
	this.el.style.left=xpos;
	this.el.style.display="block";

	angle=Math.random()*2*Math.PI;
	this.xspeed=maxspeed*Math.sin(angle);
	this.yspeed=maxspeed*Math.cos(angle);
	this.type=type;

	this.wd=this.width*0.1;
	this.hd=this.height*0.1;
}

function Moveasteroids()
{
	for(i=0; i<maxEverasteroids; i++)
	{
		if(asteroids[i]!=0) {
			asteroids[i].Move();
		}
	}
}


function Score_ShowScore() { var scoreHTML=document.getElementById('score'); scoreHTML.innerHTML=this.text+this.score; }
function Score_AddScore(award) { this.score+=award; this.ShowScore(); }
function Score_SetScore(newScore) { this.score=0; this.ShowScore(); }
function Score_GetScore() { return this.score; }


function Score(w,h,x,y,text) {
	var HTML;
	this.score=0;
	this.text=text;
	HTML="<div align='center' style='position:absolute; z-index:99; top:440; left:590;'><b>Current Score</b>: <font id='score'></font></div>";
	document.write(HTML);
	document.close();
	this.AddScore = Score_AddScore;
	this.SetScore = Score_SetScore;
	this.ShowScore = Score_ShowScore;
	this.GetScore= Score_GetScore;
}

function MoveAll() {
	var i;
	window.setTimeout("MoveAll()",updateSpeed);

	if(gameSpeedTimer>0)
	{
		gameSpeedTimer--;
		return;
	}
	gameSpeedTimer=gameSpeed;

	if(ship)
	{

		if(thumpTimer) {
			thumpTimer--;
		} else {

			if(asteroidCount)
			{
				thumpTimer=Math.round(remainingasteroids/2)+2;
				if(thumpTimer>15) {
					thumpTimer = 15;
				}
				nextThump^=1;
			}

		}
		ship.Move();
		ship.NextLife();
		if(ship.bonusLife==0)
		{
			if(score.GetScore()>15000)
			{
				ship.lives++;
				ship.bonusLife=1;
				ship.ShowLives();
			}
		}
		if(ship.dead)
		{
			delete ship;
			ship=0;
			ShowStartButton();
			lastSelectedShip=selectedShip;
			document.getElementById("health").style.display="none";
			updateScore(score.GetScore());
		}

	}

	Moveasteroids();
	ProcessExplosions();

	if(asteroidRegenTimer)
	{
		asteroidRegenTimer--;
		if(!asteroidRegenTimer)
		{
			NewLevel();
		}
	}
	else
	{
		if(!asteroidCount && running) {
			asteroidRegenTimer = 100;
		}
	}

	if(running && ship)
	{
		if(!ship.hit && !ship.dead)
		{
			timeSinceLastHit++;
			gameLength++;
			if(bshipvar == 0 && timeSinceLastHit>300)
			{
				bshipvar=new BonusShip(1);
			}

			if(bshipvar==0 && Math.random()<0.008 && gameLength>300) {
				if (asteroidCount < 6 || timeSinceLastHit > 300) {
					bshipvar = new BonusShip(1);
				} else {
					bshipvar = new BonusShip(0);
				}
			}
		}
	}
	if(bshipvar !=0)
	{
		if(bshipvar.Move())
		{
			bshipvar.Kill();
			delete bshipvar;
			bshipvar=0;
		}
	}

	if(bShipBullet !=0) {
		if (bShipBullet.Move() != 0) {
			bShipBullet.Kill();
			delete bShipBullet;
			bShipBullet = 0;
		}
	}
}


function keyDownHandler(e) {

	var code;
	if(isExplorer)
	{
		e=window.event;
		code=e.keyCode;
	}
	else {
		code = e.which;
	}

	if(ship)
	{
		if(code==37) {
			ship.angleDir = 1;
		}

		if(code==39) {
			ship.angleDir = -1;
		}
		if(code==38)
		{
			ship.thrusting=1;
		}

		if(code==32) {
			ship.Shoot();
		}

		if(code==40) {
			ship.Hyperspace();
		}
	}



}

function keyUpHandler(e) {

	var code;

	if(isExplorer)
	{
		e=window.event;
		code=e.keyCode;
	}else {
		code = e.which;
	}
	if(ship)
	{
		if(code==37 || code==39) {
			ship.angleDir = 0;
		}
		if(code==38)
		{
			ship.thrusting=0;
		}
		if(code==32) {
			ship.shooting = 0;
		}
	}

}



function NewLevel() {
	var xpos,ypos,i;


	if(bshipvar!=0)
	{
		bshipvar.Kill()
		delete bshipvar;
		bshipvar=0;
	}

	if(bShipBullet!=0)
	{
		bShipBullet.Kill();
		delete bShipBullet;
		bShipBullet=0;
	}

	maxCurrentasteroids++;
	if(maxCurrentasteroids>maxStartasteroids) {
		maxCurrentasteroids = maxStartasteroids;
	}
	remainingasteroids=maxCurrentasteroids*7;
	for(i=0; i<maxEverasteroids; i++)
	{
		if(asteroids[i]!=0)
		{
			asteroids[i].Kill();
			delete asteroids[i];
			asteroids[i]=0;
		}
		if(i<maxCurrentasteroids)
		{
			if(asteroids[i]!=0)
			{
				asteroids[i].Kill();
				delete asteroids[i];
				asteroids[i]=0;
			}

			var xo=0.5-Math.random();
			var yo=0.5-Math.random();
			if(xo<0) {
				xo = -1;
			} else {
				xo = 1;
			}

			if(yo<0) {
				yo = -1;
			} else {
				yo = 1;
			}
			xpos=ship.xpos+xo*((ship.width*5)+(Math.random()*40));
			ypos=ship.ypos+yo*((ship.height*5)+(Math.random()*40));


			asteroids[i]=new asteroid(xpos,ypos,i,2);
		}
	}

	for(i=0; i<maxExplosions; i++)
	{
		if(explosions[i]!=0)
		{
			explosions[i].Kill();
			delete explosions[i];
			explosions[i]=0;
		}
	}
	gameLength=0;

}

function RestartGame() {

	if (document.shipImages[0]==null || selectedShip!=lastSelectedShip) {
		for(i=0; i<maxShipAngles; i++) { document.shipImages[i]=new Image;  document.shipImages[i].src=imgUrl+"s"+selectedShip+"-"+shipIdx[i]+".gif"; }
	}

	var el;
	el=document.getElementById('start');
	el.style.display="none";
	ship=new Ship(Math.round(maxX/2),Math.round(maxY/2));
	maxCurrentasteroids=3;

	score.SetScore(0);
	NewLevel();

	startButtonDelay=0;
	running=1;
	turnRatio=0;

	document.images['playerpic'].src=document.shipImages[0].src;
	document.getElementById("health").style.display="block";

	shipShield=maxShipShield;
	updateShield();

}

function WriteasteroidHTML() {
	var makeHTML,i;
	for(i=0; i<maxEverasteroids; i++)
	{
		makeHTML="<DIV id='asteroid"+i+"' style='position:absolute; display:none; z-index:3;top:0; left:0; width:0; height:0'><img id='asteroidimg"+i+"' src='"+imgUrl+"fire.gif'></div>";
		document.write(makeHTML);
		document.close();
		asteroids[i]=0;
	}
}

function WriteExplosionHTML() {
	var expHTML;
	var i;
	for(i=0; i <maxExplosions; i++) {
		explosions[i] = 0;
	}
	for(i=0; i<maxExplosions*maxParticlesPerExplosion; i++)
	{
		var pName="ExpParticle"+i;
		expHTML="<div id='"+pName+"' style='position:absolute; display:none; width:1; z-index:10; height:1; top:0; left:0'><img src='"+imgUrl+"fire.gif' id='"+pName+"Img'></div>";
		document.write(expHTML);
		document.close();

	}
}

function WriteShipBulletHTML() {
	var makeHTML,i;
	for(i=0; i< maxShipBullets; i++) {
		makeHTML="<div id='shipbull"+i+"' style='position:absolute;  display:none; z-index:1; top:0; left:0; width:2; height:2'><img  width='2' height='2' src='"+imgUrl+"fire.gif'></div>";
		document.write(makeHTML);
		document.close( );
	}
	maxShipBullets-=3;
}

document.onkeydown=keyDownHandler;
document.onkeyup=keyUpHandler;

function StartTimer() {
	if(isExplorer) {
		window.setTimeout("MoveAll()",75);
		updateSpeed=75;
	} else {
		window.setTimeout("MoveAll()",50);
		updateSpeed=50;
	}
}

score = new Score(maxX,20,0,0,"");

function ShowStartButton() {
	var el;
	el=document.getElementById('start');
	el.style.display="block";
	running=0;
	document.images['startbuttonpic'].src=document.startbutton.src;
}

function startGame() {
	StartTimer();
	ShowStartButton();
}

function writeGame() {
	WriteShipBulletHTML();
	WriteasteroidHTML();
	WriteExplosionHTML();
	WriteBonusHTML();
}

function updateShield() {
	var leftBar= (shipShield/maxShipShield)*120;
	document.getElementById("hon").width=leftBar;
	document.getElementById("hoff").width=(120-leftBar);
}

