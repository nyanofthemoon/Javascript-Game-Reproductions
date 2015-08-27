var iWidth = 22;
var iHeight = 16;
var iXSpace = (iWidth + 10);
var iYSpace = (iHeight + 10);
var rowCount = 5;
var colCount = 9;
var angle = 0;
var isExplorer = 0;
var useSound = 0;
var Invaders = new Array();
var invaderXJump = 10;
var invaderYJump = 20;
var invaderTimer = 1;
var invaderExpSpeed = 1;
var invaderCount;
var maxX = 500;
var maxY = 350;
var invadersDirection = 1;
var changeDir = 0;
var maxInv = (rowCount * colCount);
var shipDir = 0;
var shipWidth = 26;
var shipHeight = 16;
var ship = 0;
var shipXShift = 10;
var shipBulletSpeed = 20;
var shipBulletHeight = 10;
var shipBullets = new Array();
var maxShipBullets = 1;
var insert;
var invaderYOffset = 90;
var score;
var maxInvaderBullets = 20;
var allowableInvaderBullets = 3;
var level = 1;
var invaderBullets = new Array();
var invaderBulletChance;
var invaderBulletHeight = new Array(12, 14);
var invaderBulletWidth = 6;
var invaderBulletSpeed = 10;
var maxInvaderPics = 6;
var invaderPics = new Array("img/i1a.gif", "img/i1b.gif", "img/i2a.gif", "img/i2b.gif", "img/i3a.gif", "img/i3b.gif");
var invaderPicIndexes = new Array(2, 3, 4, 5, 4, 5, 0, 1, 0, 1);
var landed = 0;
var maxBarrierLines = 6;
var linePos = new Array(new RowData(12, 0, 6), new RowData(4, 8, 10), new RowData(0, 16, 4), new RowData(32, 16, 4), new RowData(0, 24, 4), new RowData(32, 24, 4));
var barriers = new Array(0, 0, 0, 0);
var restartLevel = 0;
var lastScore = 0;
var delayStart = 0;
var updateSpeed;
var spaceshipYpos = 70;
var bonusSpaceship = 0;
var spaceshipSpeed = 5;
var spaceshipHeight = 14;
var spaceshipWidth = 32;
var leftMost = maxX;
var rightMost = 0;
var bottomMost = 0;
var gameSpeed = 0;
var gameSpeedTimer = 0;
var index;
var maxBarrierLines = 4;
var linePos = new Array(new RowData(14, 0, 5), new RowData(4, 8, 10), new RowData(0, 16, 5), new RowData(28, 16, 5));
isExplorer = navigator.appName.indexOf("Microsoft") != -1;

function ResetMosts() {
    leftMost = maxX;
    rightMost = 0;
    bottomMost = 0;
}

function Spaceship_Kill() {
    var el = document.getElementById('spaceship');
    el.style.display = "none";
    el = document.getElementById('spaceshipText');
    el.style.display = "none";
}

function Spaceship_Move() {
    var el = document.getElementById('spaceship');
    var elText = document.getElementById('spaceshipText');
    if (this.showBonus) {
        el.style.display = "none";
        elText.innerHTML = "<font face='Arial, Helvetica sans-serif' style='color:white'>" + this.bonus + "</font>";
        elText.style.left = this.xpos;
        elText.style.top = this.ypos;
        elText.style.display = "block";
        this.showBonus--;
        if (!this.showBonus) {
            this.Kill();
            return 1;
        }
        return 0;
    }
    this.xpos += spaceshipSpeed;
    el.style.left = this.xpos;
    if (this.xpos > maxX - this.width) {
        this.Kill();
        return 1;
    }
    return 0;
}

function Spaceship_CheckCollision(xpos, ypos) {
    if (this.showBonus)
        return;
    if (xpos < this.xpos || xpos > (this.xpos + this.width))
        return 0;
    if (ypos > this.ypos + this.height)
        return 0
    this.showBonus = 20;
    return 1;
}

function Spaceship() {
    var el = document.getElementById('spaceship');
    var bonus = Math.random();
    this.xpos = 0;
    this.ypos = spaceshipYpos;
    this.showBonus = 0;
    this.Move = Spaceship_Move;
    this.height = spaceshipHeight;
    this.width = spaceshipWidth;
    this.CheckCollision = Spaceship_CheckCollision;
    this.Kill = Spaceship_Kill;
    if (bonus < 0.25)
        this.bonus = 50;
    else if (bonus < 0.5)
        this.bonus = 75;
    else if (bonus < 0.75)
        this.bonus = 100;
    else
        this.bonus = 125;
    el.style.left = this.xpos;
    el.style.display = "block";
}

function BarrierElement_CheckCollision(xpos, ypos) {
    if (xpos < this.xpos || xpos > this.xpos + 4)
        return 0;
    if (ypos < this.ypos || ypos > this.ypos + 8)
        return 0;
    return 1;
}

function BarrierElement_Kill() {
    var element = document.getElementById(this.id);
    element.style.display = "none";
}

function BarrierElement(xpos, ypos, id) {
    var element;
    element = document.getElementById(id);
    element.style.display = "block";
    this.xpos = xpos;
    this.ypos = ypos;
    this.Kill = BarrierElement_Kill;
    this.id = id;
    this.CheckCollision = BarrierElement_CheckCollision;
    this.intact = 1;
}

function Barrier_CheckCollision(xpos, ypos, height) {
    var i;
    var element;
    if (xpos < this.xpos || xpos > this.xpos + this.width || ypos < this.ypos || ypos > this.ypos + this.height)
        return 0;
    for (i = 0; i < this.elementCount; i++) {
        if (this.elements[i] != 0) {
            if (this.elements[i].CheckCollision(xpos, ypos)) {
                this.elements[i].Kill();
                delete this.elements[i];
                this.elements[i] = 0;
                return 1;
            }

            if (this.elements[i].CheckCollision(xpos, ypos + height)) {
                this.elements[i].Kill();
                delete this.elements[i];
                this.elements[i] = 0;
                return 1;
            }
        }
    }
    return 0;
}

function Barrier_CheckInvaderCollision() {
    var i;
    if (bottomMost >= this.ypos) {
        for (i = 0; i < this.elementCount; i++) {
            if (this.elements[i] != 0) {
                if (invaderXJump > 0) {
                    if (this.elements[i].xpos < rightMost && this.elements[i].ypos <= bottomMost) {
                        this.elements[i].Kill();
                        delete this.elements[i];
                        this.elements[i] = 0;
                    }
                } else {
                    if (this.elements[i].xpos > leftMost && this.elements[i].ypos <= bottomMost) {
                        this.elements[i].Kill();
                        delete this.elements[i];
                        this.elements[i] = 0;
                    }
                }
            }
        }
    }
}

function Barrier(barrierXpos, barrierYpos, barrierID) {
    var elementID = 0;
    this.xpos = barrierXpos;
    this.ypos = barrierYpos;
    this.elements = new Array();
    this.width = 48;
    this.height = 32;
    this.CheckCollision = Barrier_CheckCollision;
    this.CheckInvaderCollision = Barrier_CheckInvaderCollision;
    for (i = 0; i < maxBarrierLines; i++) {
        for (j = 0; j < linePos[i].count; j++) {
            var xpos = linePos[i].xpos + (j * 4) + barrierXpos;
            var ypos = barrierYpos + linePos[i].ypos;
            var divID = "Bar" + barrierID + "_" + elementID;
            this.elements[elementID] = new BarrierElement(xpos, ypos, divID);
            elementID++;
        }
    }
    this.elementCount = elementID;
}

function RowData(xpos, ypos, count) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.count = count;
}

function WriteBarrierHTML() {
    var insert;
    var barrierXStep = maxX / 5;
    var barrierYpos;
    var barrierXpos = barrierXStep;
    if (isExplorer)
        barrierYpos = maxY - shipHeight * 2 - 18;
    else
        barrierYpos = maxY - shipHeight * 2 - 5;
    for (id = 0; id < 4; id++) {
        var elementID = 0;
        for (i = 0; i < maxBarrierLines; i++) {
            for (j = 0; j < linePos[i].count; j++) {
                var xpos = linePos[i].xpos + (j * 4) + barrierXpos;
                var ypos = barrierYpos + linePos[i].ypos;
                var divID = "Bar" + id + "_" + elementID;
                insert = "<div id='" + divID + "' style='position:absolute; display:none ;width:4; height:7 ; top:" + ypos + "; left:" + xpos + "; background:#EE0000'></div>";
                elementID++;
                document.write(insert);
                document.close();
            }
        }
        barrierXpos += barrierXStep;
    }
}

function CreateBarriers() {
    var i;
    var barrierXStep = maxX / 5;
    var xpos = barrierXStep;
    var barrierYpos
    if (isExplorer)
        barrierYpos = maxY - shipHeight * 2 - 18;
    else
        barrierYpos = maxY - shipHeight * 2 - 5;
    for (i = 0; i < 4; i++) {
        if (barriers[i] != 0)
            delete barriers[i];
        barriers[i] = new Barrier(xpos, barrierYpos, i);
        xpos += barrierXStep;
    }
}

function InvaderBullet_InRectangle(xpos, ypos, width, height) {
    if (this.xpos <= xpos || this.xpos >= (xpos + 20))
        return false;
    if (this.ypos >= ypos && this.ypos <= (ypos + 20)) {
        return true;
    }
    if ((this.ypos + 15) >= ypos && (this.ypos + 15) <= (ypos + 20)) {
        return true;
    }
    return false;
}

function InvaderBullet_Move() {
    this.ypos += this.speed;
    if (this.ypos >= ship.ypos + shipHeight) {
        this.Kill();
        return 1;
    }
    this.element.style.top = this.ypos;
    if (this.type == 0) {
        this.bulletAnimation++;
        if (this.bulletAnimation >= 6) {
            this.bulletAnimation = 0;
        }
        document.images[this.graphicId].src = document.iBullet1[this.bulletAnimation].src;
    } else {
        this.bulletAnimation++;
        if (this.bulletAnimation >= 2) {
            this.bulletAnimation = 0;
        }
        document.images[this.graphicId].src = document.iBullet2[this.bulletAnimation].src;
    }
    return 0;
}

function InvaderBullet_Kill() {
    this.element.style.display = "none";
}

function InvaderBullet_KillAll() {
    var i;
    for (i = 0; i < allowableInvaderBullets; i++) {
        if (invaderBullets[i] != 0) {
            invaderBullets[i].Kill();
            delete invaderBullets[i];
            invaderBullets[i] = 0;
        }
    }
}

function InvaderBullet(idDiv, idSrc, xpos, ypos) {
    this.state = 0;
    this.xpos = xpos;
    this.ypos = ypos;
    this.speed = invaderBulletSpeed;
    this.idDiv = idDiv;
    this.graphicId = idSrc;
    this.height = invaderBulletHeight;
    this.Move = InvaderBullet_Move;
    this.Kill = InvaderBullet_Kill;
    this.InRectangle = InvaderBullet_InRectangle;
    this.element = document.getElementById(this.idDiv);
    this.element.style.display = "block";
    this.element.style.left = xpos;
    this.element.style.top = ypos;
    this.bulletAnimation = 0;
    if (Math.random() < 0.5) {
        this.type = 0;
        document.images[idSrc].src = document.iBullet1[this.bulletAnimation].src;
    } else {
        this.type = 1;
        document.images[idSrc].src = document.iBullet2[this.bulletAnimation].src;
        this.speed += 2;
    }
    this.element.style.height = invaderBulletHeight[this.type];
}

function WriteInvaderBulletHTML() {
    var i;
    var make;
    for (i = 0; i < maxInvaderBullets; i++) {
        make = "<div id=\'IBDiv" + i + "\' style=\'display:none; position:absolute ;width:3 ;height:0 top:0 ;left:0\'>";
        make += "<img id=\'IBSrc" + i + "\' src=\'img/b01.gif\'>";
        make = make + "</div>";
        document.write(make);
        document.close();
        invaderBullets[i] = 0;// Clear the bullet array
    }
}

function Invader_GetYpos() {
    return this.ypos;
}
function Invader_GetXpos() {
    return this.xpos;
}

function Invader_Move() {
    var element = document.getElementById(this.id);
    var oldX = this.xpos;
    oldX += invaderXJump;
    if (invaderXJump > 0) {
        if ((oldX >= (maxX - invaderXJump))) {
            changeDir = 1;
        }
        this.xpos += invaderXJump;
    } else {
        if (oldX <= (-invaderXJump)) {
            changeDir = 1;
        }
        this.xpos += invaderXJump;
    }
    element.style.left = this.xpos;
    element.style.top = this.ypos;
    this.incarnation++;
    if (this.incarnation >= 2)
        this.incarnation = 0;
    if (this.incarnation == 0)
        document.images[this.graphicId].src = document.imageArray[this.graphic1].src;
    else
        document.images[this.graphicId].src = document.imageArray[this.graphic2].src;
    if (this.xpos < leftMost)
        leftMost = this.xpos;
    if (this.xpos > rightMost)
        rightMost = this.xpos;
    if (this.ypos + this.height > bottomMost)
        bottomMost = this.ypos + this.height;
}

function Invader_Kill() {
    var element = document.getElementById(this.id);
    element.style.display = "none";
}

function Invader_CollisionDetection() {
    var i;
    var graphic;
    for (i = 0; i < maxShipBullets; i++) {
        if (shipBullets[i] != 0) {
            if (shipBullets[i].InRectangle(this.xpos, this.ypos, this.width, this.height)) {
                this.state = 3;
                document.images[this.graphicId].src = document.blowImage.src;
                shipBullets[i].Kill();
                delete shipBullets[i];
                shipBullets[i] = 0;
                return false;
            }
        }
    }
    return 0;
}

function Invader_SetPos(xpos, ypos) {
    var element = document.getElementById(this.id);
    element.style.left = xpos;
    element.style.top = ypos;
    this.xpos = xpos;
    this.ypos = ypos;
}

function Invader_PosDelta(xposDelta, yposDelta) {
    var element = document.getElementById(this.id);
    this.xpos = this.xpos + xposDelta;
    this.ypos = this.ypos + yposDelta;
    element.style.left = this.xpos;
    element.style.top = this.ypos;
}

function Invader(xpos, ypos, id, stage1, stage2, graphicID, iscore) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = iWidth;
    this.height = iHeight;
    this.id = id;
    this.graphic1 = stage1;
    this.graphic2 = stage2;
    this.incarnation = 0;
    this.state = 0;// For explosion (=1)
    this.graphicId = graphicID;
    this.Getxpos = Invader_GetXpos;
    this.GetYpos = Invader_GetYpos;
    this.SetPos = Invader_SetPos;
    this.Move = Invader_Move;
    this.PosDelta = Invader_PosDelta;
    this.Kill = Invader_Kill;
    this.CollisionDetection = Invader_CollisionDetection;
    this.score = iscore;

    var el = document.getElementById(this.id);
    el.style.display = "block";
    el.style.top = ypos;
    el.style.left = xpos;
    document.images[this.graphicId].src = document.imageArray[stage1].src;
}

function InitialiseInvaders() {
    var i, j;
    for (i = 0; i < rowCount; i++) {
        for (j = 0; j < colCount; j++) {
            var identifier = (j + (i * colCount));
            var invaderYpos = (i * iYSpace) + invaderYOffset;
            insert = "<div id=\'Inv" + identifier + "\' style=\'position:absolute; z-index:2; display:none; width:" + iWidth + "px; height:" + iHeight + "px ;left:0" + j * iXSpace + "px ; top:" + invaderYpos + "px\'>";
            insert = insert + "<img id=\'ISrc" + identifier + "\'src=\'\'></div>";
            document.write(insert);
            document.close();
            Invaders[identifier] = 0;
        }
    }
}

function Invader_KillAll() {
    var i;
    for (i = 0; i < maxInv; i++) {
        if (Invaders[i] != 0) {
            Invaders[i].Kill();
            delete Invaders[i];
            Invaders[i] = 0;
        }
    }
}

function ReGenerateInvaders() {
    var i, j;
    invScore = rowCount * 10;
    for (i = 0; i < rowCount; i++) {
        for (j = 0; j < colCount; j++) {
            var identifier = (j + (i * colCount));
            var invaderYpos = (i * iYSpace) + invaderYOffset;
            CreateInvader(j * iXSpace, invaderYpos, identifier, invaderPicIndexes[i * 2], invaderPicIndexes[(i * 2) + 1], (invScore / 2));
        }
        invScore = invScore - 10;
    }
    invaderCount = rowCount * colCount;
    invaderXJump = Math.abs(invaderXJump);
    changeDir = 0;
    invaderTimer = Math.round(invaderCount / 2);
    lastScore = 0;
}

function ShipBullet_InRectangle(xpos, ypos, width, height) {
    if (this.xpos <= xpos || this.xpos >= (xpos + 20))
        return false;
    if (this.ypos >= ypos && this.ypos <= (ypos + 20)) {
        return true;
    }
    if ((this.ypos + 15) >= ypos && (this.ypos + 15) <= (ypos + 20)) {
        return true;
    }
    return false;
}

function ShipBullet_Move() {
    var element;
    element = document.getElementById(this.idDiv);
    if (this.ypos > 0) {
        this.ypos -= shipBulletSpeed;
    }
    if (this.ypos <= 68) {
        this.Kill();
        return 1;
    }
    element.style.top = this.ypos;
    return 0;
}

function ShipBullet_Kill() {
    var element;
    element = document.getElementById(this.idDiv);
    element.style.display = "none";
}

function ShipBullet_KillAll() {
    var i;
    for (i = 0; i < maxShipBullets; i++) {
        if (shipBullets[i] != 0) {
            shipBullets[i].Kill();
            delete shipBullets[i];
            shipBullets[i] = 0;
        }
    }
}

function ShipBullet(idDiv, idSrc, xpos, ypos) {
    var element;
    this.state = 0;
    this.xpos = xpos;
    this.ypos = ypos;
    this.idDiv = idDiv;
    this.idSrc = idSrc;
    this.height = shipBulletHeight;
    this.Move = ShipBullet_Move;
    this.Kill = ShipBullet_Kill;
    this.InRectangle = ShipBullet_InRectangle;
    element = document.getElementById(this.idDiv);
    element.style.display = "block";
    element.style.left = xpos;
    element.style.top = ypos;
}

function WriteShipBulletHTML() {
    var i;
    var make;
    for (i = 0; i < maxShipBullets; i++) {
        make = "<div id=\'SBDiv" + i + "\' style=\'display:none; position:absolute ;width:3 ;height:" + shipBulletHeight + " ;background:white; top:0 ;left:0\'>";
        make = make + "<img src='img/bullet.gif'></div>";
        document.write(make);
        document.close();
        shipBullets[i] = 0;// Clear the bullet array
    }
}

var shipExplosion = new Array("img/sexp0.gif", "img/sexp1.gif", "img/sexp2.gif", "img/sexp3.gif", "img/sexp0.gif", "img/sexp1.gif", "img/sexp2.gif", "img/sexp3.gif");
document.shipexp = new Array();
for (index = 0; index < 8; index++) {
    document.shipexp[index] = new Image();
    document.shipexp[index].src = shipExplosion[index];
}

function Ship_MoveShip() {
    var element = document.getElementById('shipDiv');
    var i, j;
    if (!this.state) {
        if ((this.xpos + this.xDir) >= 0 && (this.xpos + this.xDir) <= (maxX - shipWidth))
            this.xpos += this.xDir;
        element.style.left = this.xpos;
        element.style.top = this.ypos;
    } else {
        if (this.state == 100)
            return;
        if (this.state < (shipExplosion.length * 2)) {
            var currentExp = this.state;
            if (currentExp >= shipExplosion.length)
                currentExp = 1;
            currentExp--;
            document.images['shipImg'].src = document.shipexp[currentExp].src;
            this.state++;
        } else {
            this.state = 0;
            InvaderBullet_KillAll();
            ShipBullet_KillAll();
            if (landed) {
                this.lives = 0;
            }
            if (this.lives) {
                document.images['shipImg'].src = document.shipImage.src;
                this.xpos = maxX / 2;
                this.lives--;
                this.ShowLives();
                delayStart = 30;
            } else {
                this.state = 100;
                return 1;
            }
        }
    }
    for (i = 0; i < maxShipBullets; i++) {
        var bullet;
        if (shipBullets[i] != 0) {
            if (shipBullets[i].Move() != 0) {
                delete shipBullets[i];
                shipBullets[i] = 0;
            } else {
                for (j = 0; j < 4; j++) {
                    if (barriers[j].CheckCollision(shipBullets[i].xpos, shipBullets[i].ypos, shipBulletHeight) || barriers[j].CheckCollision(shipBullets[i].xpos, shipBullets[i].ypos + (shipBulletHeight / 2), shipBulletHeight / 2)) {
                        shipBullets[i].Kill();
                        delete shipBullets[i];
                        shipBullets[i] = 0;
                        break;
                    }
                }
                if (bonusSpaceship != 0 && shipBullets[i] != 0) {
                    if (bonusSpaceship.CheckCollision(shipBullets[i].xpos, shipBullets[i].ypos)) {
                        score.AddScore(bonusSpaceship.bonus);
                        shipBullets[i].Kill();
                        delete shipBullets[i];
                        shipBullets[i] = 0;
                    }
                }
            }
        }
    }
    if (score.GetScore() > 999 && !this.lifeGiven) {
        this.lives++;
        this.ShowLives();
        this.lifeGiven = 1;
    }
    return 0;
}

function Ship_Die() {
    ship.state = 1;
}

function Ship_Kill() {
    var element = document.getElementById('shipDiv');
    element.style.display = "none";
}

function Ship_Shoot() {
    var i;
    if (!this.state) {
        for (i = 0; i < maxShipBullets; i++) {
            if (shipBullets[i] == 0) {
                shipBullets[i] = new ShipBullet("SBDiv" + i, "SBSrc" + i, this.xpos + (shipWidth / 2), this.ypos - shipHeight / 2);
                ;
                break;
            }
        }
    }
}

function Ship_SetDir(dir) {
    this.xDir = dir;
}

function Ship_ShowLives() {
    var i;
    for (i = 0; i < 4; i++) {
        if (this.lives > i)
            document.images["life" + i].style.display = "block";
        else
            document.images["life" + i].style.display = "none";
    }
}

function Ship(startX, startY) {
    this.xpos = startX;
    this.ypos = startY;
    this.xDir = 0;
    this.Move = Ship_MoveShip;
    this.SetDir = Ship_SetDir;
    this.Shoot = Ship_Shoot;
    this.Die = Ship_Die;
    this.Kill = Ship_Kill;
    this.ShowLives = Ship_ShowLives;
    this.lives = 3;
    this.lifeGiven = 0;
    this.state = 0;
    document.images['shipImg'].src = document.shipImage.src;
    var el = document.getElementById('shipDiv');
    el.style.display = "block";
}

function Score_ShowScore() {
    var scoreHTML = document.getElementById('score');
    scoreHTML.innerHTML = this.text + this.score;
}
function Score_AddScore(award) {
    this.score += award;
    this.ShowScore();
}
function Score_SetScore(newScore) {
    this.score = 0;
    this.ShowScore();
}
function Score_GetScore() {
    return this.score;
}
function Score(w, h, x, y, text) {
    var HTML;
    this.score = 0;
    this.text = text;
    this.AddScore = Score_AddScore;
    this.SetScore = Score_SetScore;
    this.ShowScore = Score_ShowScore;
    this.GetScore = Score_GetScore;
}

function CreateInvader(xpos, ypos, identifier, stage1, stage2, iscore) {
    Invaders[identifier] = new Invader(xpos, ypos, "Inv" + identifier, stage1, stage2, "ISrc" + identifier, iscore);
}

function MoveAll() {
    var i, j;
    var lastDir = 0;
    var moved = 0;
    var barrier;
    window.setTimeout("MoveAll()", 10);
    if (ship == 0)
        return;
    if (gameSpeedTimer != 0) {
        gameSpeedTimer--;
        return;
    }
    gameSpeedTimer = gameSpeed;
    if (delayStart) {
        delayStart--;
        return;
    }
    if (restartLevel) {
        restartLevel--;
        if (!restartLevel) {
            ship.xpos = Math.round(maxX / 2);
            allowableInvaderBullets += 2;
            if (allowableInvaderBullets > maxInvaderBullets)
                allowableInvaderBullets = maxInvaderBullets;
            NewLevel();
        }
    }
    invaderTimer--;
    for (i = 0; i < maxInv; i++) {
        if (Invaders[i]) {
            if (Invaders[i] != 0 && invaderTimer == 0 && !ship.state) {
                Invaders[i].Move();
                if (Invaders[i].ypos > (maxY - iHeight)) {
                    ship.Die();
                    landed = 1;
                }
            }
            Invaders[i].CollisionDetection();
            if (Invaders[i].state) {
                Invaders[i].state--;
                if (Invaders[i].state == 0) {
                    Invaders[i].Kill();
                    score.AddScore(Invaders[i].score);
                    delete Invaders[i];
                    Invaders[i] = 0;
                    invaderCount--;
                    if (invaderCount == 0)
                        restartLevel = 50;
                    if (invaderCount < 5)
                        invaderBulletChance = 0.5;
                }
            }
            if ((Math.random() < invaderBulletChance) && !ship.state && Invaders[i]) {
                for (j = 0; j < allowableInvaderBullets; j++) {
                    if (invaderBullets[j] == 0) {
                        var xDelta = 0;
                        var rnd = Math.random();
                        if (rnd < 0.33)
                            xDelta = -3;
                        if (rnd > 0.66)
                            xDelta = 3;
                        invaderBullets[j] = new InvaderBullet("IBDiv" + j, "IBSrc" + j, Invaders[i].xpos + (iWidth / 2) + xDelta, Invaders[i].ypos + iHeight);
                        break;
                    }
                }
            }
        }
    }
    for (i = 0; i < allowableInvaderBullets; i++) {
        if (invaderBullets[i] != 0) {
            if (invaderBullets[i].Move() != 0) {
                invaderBullets[i].Kill();
                delete invaderBullets[i];
                invaderBullets[i] = 0;
            } else {
                if (invaderBullets[i].InRectangle(ship.xpos, ship.ypos, shipWidth, shipHeight)) {
                    invaderBullets[i].Kill();
                    delete invaderBullets[i];
                    invaderBullets[i] = 0;
                    ship.Die();
                }
                if (invaderBullets[i] != 0) {
                    for (barrier = 0; barrier < 4; barrier++) {
                        if (barriers[barrier].CheckCollision(invaderBullets[i].xpos, invaderBullets[i].ypos, invaderBulletHeight)) {
                            invaderBullets[i].Kill();
                            delete invaderBullets[i];
                            invaderBullets[i] = 0;
                            break;
                        }
                    }
                }
            }
        }
    }
    if (!invaderTimer) {
        invaderTimer = Math.round((invaderCount / 2) / level);
        for (barrier = 0; barrier < 4; barrier++)
            if (barriers[barrier] != 0)
                barriers[barrier].CheckInvaderCollision();
    }
    if (changeDir != 0) {
        for (i = 0; i < maxInv; i++) {
            if (Invaders[i] != 0)
                Invaders[i].PosDelta(0, invaderYJump);
        }
        invaderXJump = -invaderXJump;
        changeDir = 0;
        ResetMosts();
    }
    if (ship != 0) {
        if (bonusSpaceship == 0) {
            if (Math.random() < 0.002)
                bonusSpaceship = new Spaceship();
        } else {
            if (bonusSpaceship.Move()) {
                delete bonusSpaceship;
                bonusSpaceship = 0;
            }
        }
        if (ship.Move()) {
            Invader_KillAll();
            if (bonusSpaceship) {
                bonusSpaceship.Kill();
                delete bonusSpaceship;
                bonusSpaceship = 0;
            }
            ship.Kill();
            delete ship;
            ship = 0;
            var gOverEl = document.getElementById('gameOver');
            gOverEl.style.display = "block";
            updateScore(score.GetScore());
        }
    }
    if (lastScore != score.GetScore()) {
        score.ShowScore();
        lastScore = score.GetScore();
    }
}

function keyDownHandler(e) {
    var code;
    if (isExplorer) {
        e = window.event;
        code = e.keyCode;
    } else
        code = e.which;
    if (code == 37 && ship) {
        ship.SetDir(-shipXShift);
    }
    if (code == 39 && ship)
        ship.SetDir(shipXShift);
    if ((code == 38 || code == 40) && ship)
        ship.Shoot();
}

function keyUpHandler(e) {
    var code;
    if (navigator.appName.indexOf("Microsoft") != -1) {
        e = window.event;
        code = e.keyCode;
    } else
        code = e.which;
    if (ship && (code == 37 || code == 39))
        ship.SetDir(0);
}

function NewLevel() {
    ReGenerateInvaders();
    CreateBarriers();
    invaderBulletChance = 0.1;
    delayStart = 0;
    if (bonusSpaceship) {
        bonusSpaceship.Kill();
        bonusSpaceship = 0;
    }
    ResetMosts();
    gameSpeedTimer = gameSpeed;
}

function RestartGame() {
    var el = document.getElementById('gameOver');
    el.style.display = "none";
    landed = 0;
    restartLevel = 0;
    if (ship != 0)
        delete ship;
    ship = new Ship(Math.round(maxX / 2), maxY);
    score.SetScore(0);
    NewLevel();
    running = 1;
}

document.onkeydown = keyDownHandler;
document.onkeyup = keyUpHandler;

function startNeverInvaders() {
    updateSpeed = 10;
    gameSpeed = 10;
    window.setTimeout("MoveAll()", 10);
    document.shipImage = new Image;
    document.shipImage.src = "img/ship1.gif";
    document.blowImage = new Image;
    document.blowImage.src = "img/iexp.gif";
    document.imageArray = new Array();
    for (index = 0; index < maxInvaderPics; index++) {
        document.imageArray[index] = new Image();
        document.imageArray[index].src = invaderPics[index];
    }
    var b1Names = new Array("img/b01.gif", "img/b02.gif", "img/b03.gif", "img/b04.gif", "img/b05.gif", "img/b06.gif");
    document.iBullet1 = new Array();
    for (index = 0; index < 6; index++) {
        document.iBullet1[index] = new Image()
        document.iBullet1[index].src = b1Names[index];
    }
    var b2Names = new Array("img/b10.gif", "img/b11.gif");
    document.iBullet2 = new Array();
    for (index = 0; index < 2; index++) {
        document.iBullet2[index] = new Image()
        document.iBullet2[index].src = b2Names[index];
    }

    InitialiseInvaders();
    WriteShipBulletHTML();
    WriteInvaderBulletHTML();
    WriteBarrierHTML();
    score = new Score(0, maxX / 2, 180, 16, "<b>SCORE</b>: ");
    document.getElementById('gameOver').style.display = "block";
}