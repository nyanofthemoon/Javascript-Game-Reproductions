function ldimg() {
    this.length = ldimg.arguments.length;
    for (var i = 0; i < this.length; i++) {
        this[i] = new Image();
        this[i].src = ldimg.arguments[i];
    }
}
var pics = new ldimg("img/dark.gif", "img/pale.gif", "img/plr1.gif", "img/plr2.gif", "img/plr1k.gif", "img/plr2k.gif", "img/nt1.gif", "img/nt2.gif", "img/nt1k.gif", "img/nt2k.gif");
var black = -1;
var red = 1;
var sqd = 35;
var ptgl = false;
var mymov = false;
var dblj = false;
var ntmov = false;
var gisover = false;
var saff = saft = null;
var toggler = null;
var togglers = 0;
var myeat = 0;
var youeat = 0;
var nint = 10;
function Board() {
    board = new Array();
    for (var i = 0; i < 8; i++) {
        board[i] = new Array();
        for (var j = 0; j < 8; j++) board[i][j] = Board.arguments[8 * j + i];
    }
    board[-2] = new Array();
    board[-1] = new Array();
    board[8] = new Array();
    board[9] = new Array();
}
var board;
Board(1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1, 0, -1);
function cons(str) {
    document.getElementById("info").innerHTML = "NPC ate <u>" + myeat + "</u> of your pieces...<br>You ate <u>" + youeat + "</u> of NPC's pieces...<br><br><br>" + "<i>" + str + "</i>";
}
function ismov(i, j) {
    return (((i % 2) + j) % 2 == 0);
}
function Coord(x, y) {
    this.x = x;
    this.y = y;
}
function coord(x, y) {
    c = new Coord(x, y);
    return c;
}
function clicked(i, j) {
    if (mymov) {
        if (integ(board[i][j]) == 1) toggle(i, j); else if (ptgl) move(selected, coord(i, j)); else cons("Click on one of the black pieces and click again to move it!<br><br>");
    } else {
        cons("NPC is still playing... please wait.<br><br>");
    }
}
function toggle(x, y) {
    if (mymov) {
        if (ptgl) draw(selected.x, selected.y, "img/plr1" + ((board[selected.x][selected.y] == 1.1) ? "k" : "") + ".gif");
        if (ptgl && (selected.x == x) && (selected.y == y)) {
            ptgl = false;
            if (dblj) {
                mymov = dblj = false;
                ntai();
            }
        } else {
            ptgl = true;
            draw(x, y, "img/plr2" + ((board[x][y] == 1.1) ? "k" : "") + ".gif");
        }
        selected = coord(x, y);
    } else {
        if ((ptgl) && (integ(board[selected_c.x][selected_c.y]) == -1)) draw(selected_c.x, selected_c.y, "img/nt1" + ((board[selected_c.x][selected_c.y] == -1.1) ? "k" : "") + ".gif");
        if (ptgl && (selected_c.x == x) && (selected_c.y == y)) {
            ptgl = false;
        } else {
            ptgl = true;
            draw(x, y, "img/nt2" + ((board[x][y] == -1.1) ? "k" : "") + ".gif");
        }
        selected_c = coord(x, y);
    }
}
function draw(x, y, name) {
    document.images["case" + x + "" + y].src = name;
}
function integ(num) {
    if (num != null) return Math.round(num); else return null;
}
function abs(num) {
    return Math.abs(num);
}
function sign(num) {
    if (num < 0) return -1; else return 1;
}
function concatenate(arr1, arr2) {
    for (var i = 0; i < arr2.length; i++) arr1[arr1.length + i] = arr2[i];
    return arr1;
}
function legal_move(from, to) {
    if ((to.x < 0) || (to.y < 0) || (to.x > 7) || (to.y > 7)) return false;
    piece = board[from.x][from.y];
    distance = coord(to.x - from.x, to.y - from.y);
    if ((distance.x == 0) || (distance.y == 0)) {
        cons("Pieces can only be moved diagonally...<br><br>");
        return false;
    }
    if (abs(distance.x) != abs(distance.y)) {
        cons("Sorry, this move is invalid in a Checkers games...<br><br>");
        return false;
    }
    if (abs(distance.x) > 2) {
        cons("Sorry, this move is invalid in a Checkers games...<br><br>");
        return false;
    }
    if ((abs(distance.x) == 1) && dblj) {
        return false;
    }
    if ((board[to.x][to.y] != 0) || (piece == 0)) {
        return false;
    }
    if ((abs(distance.x) == 2) && (integ(piece) != -integ(board[from.x + sign(distance.x)][from.y + sign(distance.y)]))) {
        return false;
    }
    if ((integ(piece) == piece) && (sign(piece) != sign(distance.y))) {
        return false;
    }
    return true;
}
function move(from, to) {
    mymov = true;
    if (legal_move(from, to)) {
        piece = board[from.x][from.y];
        distance = coord(to.x - from.x, to.y - from.y);
        if ((abs(distance.x) == 1) && (board[to.x][to.y] == 0)) {
            swap(from, to);
        } else if ((abs(distance.x) == 2) && (integ(piece) != integ(board[from.x + sign(distance.x)][from.y + sign(distance.y)]))) {
            dblj = false;
            swap(from, to);
            remove(from.x + sign(distance.x), from.y + sign(distance.y));
            if ((legal_move(to, coord(to.x + 2, to.y + 2))) || (legal_move(to, coord(to.x + 2, to.y - 2))) || (legal_move(to, coord(to.x - 2, to.y - 2))) || (legal_move(to, coord(to.x - 2, to.y + 2)))) {
                dblj = true;
                cons("Complete the double gjmp or click your piece to stand still.<br><br>");
            }
        }
        if ((board[to.x][to.y] == 1) && (to.y == 7)) king_me(to.x, to.y);
        selected = to;
        if (gover() && !dblj) {
            setTimeout("toggle(" + to.x + "," + to.y + ");mymov = dblj = false;ntai();", 1000);
        }
    }
    return true;
}
function king_me(x, y) {
    if (board[x][y] == 1) {
        board[x][y] = 1.1;
        draw(x, y, "img/plr2k.gif");
    } else if (board[x][y] == -1) {
        board[x][y] = -1.1;
        draw(x, y, "img/nt2k.gif");
    }
}
function swap(from, to) {
    if (mymov || ntmov) {
        dummy_src = document.images["case" + to.x + "" + to.y].src;
        document.images["case" + to.x + "" + to.y].src = document.images["case" + from.x + "" + from.y].src;
        document.images["case" + from.x + "" + from.y].src = dummy_src;
    }
    dummy_num = board[from.x][from.y];
    board[from.x][from.y] = board[to.x][to.y];
    board[to.x][to.y] = dummy_num;
}
function remove(x, y) {
    if (mymov) {
        youeat++;
    } else {
        myeat++;
    }
    draw(x, y, "img/pale.gif");
    board[x][y] = 0;
}
function Result(val) {
    this.high = val;
    this.dir = new Array();
}
function ntmove(from, to) {
    toggle(from.x, from.y);
    ntmov = true;
    swap(from, to);
    if (abs(from.x - to.x) == 2) {
        remove(from.x + sign(to.x - from.x), from.y + sign(to.y - from.y));
    }
    if ((board[to.x][to.y] == -1) && (to.y == 0)) king_me(to.x, to.y);
    setTimeout("selected_c = coord(" + to.x + "," + to.y + ");ptgl = true;", 900);
    setTimeout("bak=mymov;mymov=false;toggle(" + to.x + "," + to.y + ");mymov=bak;", 1000);
    if (gover()) {
        setTimeout("ntmov = false;mymov = true;togglers=0;", 600);
        cons("It's now your turn. Please make your move.<br><br>");
    }
    return true;
}
function gover() {
    comp = you = false;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (integ(board[i][j]) == -1) comp = true;
            if (integ(board[i][j]) == 1) you = true;
        }
    }
    if (!comp) {
        cons("You have defeated the NPC!<br><br>");
        updateScore(999999999);
    } else {
    }
    if (!you) {
        cons("NPC has won. Play another game?<br><br>");
    } else {
    }
    gisover = (!comp || !you);
    return (!gisover);
}
function ntai() {
    for (var j = 0; j < 8; j++) {
        for (var i = 0; i < 8; i++) {
            if (integ(board[i][j]) == 1) {
                if ((legal_move(coord(i, j), coord(i + 2, j + 2))) && (blk(coord(i + 2, j + 2), coord(i + 1, j + 1)))) {
                    return true;
                }
                if ((legal_move(coord(i, j), coord(i - 2, j + 2))) && (blk(coord(i - 2, j + 2), coord(i - 1, j + 1)))) {
                    return true;
                }
            }
            if (board[i][j] == 1.1) {
                if ((legal_move(coord(i, j), coord(i - 2, j - 2))) && (blk(coord(i - 2, j - 2), coord(i - 1, j - 1)))) {
                    return true;
                }
                if ((legal_move(coord(i, j), coord(i + 2, j - 2))) && (blk(coord(i + 2, j - 2), coord(i + 1, j - 1)))) {
                    return true;
                }
            }
        }
    }
    for (var j = 7; j >= 0; j--) {
        for (var i = 0; i < 8; i++) {
            if (gjmp(i, j))return true;
        }
    }
    saff = null;
    for (var j = 0; j < 8; j++) {
        for (var i = 0; i < 8; i++) {
            if (one(i, j))return true;
        }
    }
    if (saff != null) {
        ntmove(saff, saft);
    } else {
        cons("You have defeated the NPC!<br><br>");
        updateScore(999999999);
        gisover = true;
    }
    saff = saft = null;
    return false;
}
function gjmp(i, j) {
    if (board[i][j] == -1.1) {
        if (legal_move(coord(i, j), coord(i + 2, j + 2))) {
            ntmove(coord(i, j), coord(i + 2, j + 2));
            setTimeout("gjmp(" + (i + 2) + "," + (j + 2) + ");", 500);
            return true;
        }
        if (legal_move(coord(i, j), coord(i - 2, j + 2))) {
            ntmove(coord(i, j), coord(i - 2, j + 2));
            setTimeout("gjmp(" + (i - 2) + "," + (j + 2) + ");", 500);
            return true;
        }
    }
    if (integ(board[i][j]) == -1) {
        if (legal_move(coord(i, j), coord(i - 2, j - 2))) {
            ntmove(coord(i, j), coord(i - 2, j - 2));
            setTimeout("gjmp(" + (i - 2) + "," + (j - 2) + ");", 500);
            return true;
        }
        if (legal_move(coord(i, j), coord(i + 2, j - 2))) {
            ntmove(coord(i, j), coord(i + 2, j - 2));
            setTimeout("gjmp(" + (i + 2) + "," + (j - 2) + ");", 500);
            return true;
        }
    }
    return false;
}
function one(i, j) {
    if (board[i][j] == -1.1) {
        if (legal_move(coord(i, j), coord(i + 1, j + 1))) {
            saff = coord(i, j);
            saft = coord(i + 1, j + 1);
            if (intp(coord(i, j), coord(i + 1, j + 1))) {
                ntmove(coord(i, j), coord(i + 1, j + 1));
                return true;
            }
        }
        if (legal_move(coord(i, j), coord(i - 1, j + 1))) {
            saff = coord(i, j);
            saft = coord(i - 1, j + 1);
            if (intp(coord(i, j), coord(i - 1, j + 1))) {
                ntmove(coord(i, j), coord(i - 1, j + 1));
                return true;
            }
        }
    }
    if (integ(board[i][j]) == -1) {
        if (legal_move(coord(i, j), coord(i + 1, j - 1))) {
            saff = coord(i, j);
            saft = coord(i + 1, j - 1);
            if (intp(coord(i, j), coord(i + 1, j - 1))) {
                ntmove(coord(i, j), coord(i + 1, j - 1));
                return true;
            }
        }
        if (legal_move(coord(i, j), coord(i - 1, j - 1))) {
            saff = coord(i, j);
            saft = coord(i - 1, j - 1);
            if (intp(coord(i, j), coord(i - 1, j - 1))) {
                ntmove(coord(i, j), coord(i - 1, j - 1));
                return true;
            }
        }
    }
    return false;
}
function gposs(x, y) {
    if (!gjmp(x, y)) if (!one(x, y)) return true; else return false; else return false;
}
function blk(end, s) {
    i = end.x;
    j = end.y;
    if (!gposs(s.x, s.y)) return true; else if ((integ(board[i - 1][j + 1]) == -1) && (legal_move(coord(i - 1, j + 1), coord(i, j)))) {
        return ntmove(coord(i - 1, j + 1), coord(i, j));
    } else if ((integ(board[i + 1][j + 1]) == -1) && (legal_move(coord(i + 1, j + 1), coord(i, j)))) {
        return ntmove(coord(i + 1, j + 1), coord(i, j));
    } else if ((board[i - 1][j - 1] == -1.1) && (legal_move(coord(i - 1, j - 1), coord(i, j)))) {
        return ntmove(coord(i - 1, j - 1), coord(i, j));
    } else if ((board[i + 1][j - 1] == -1.1) && (legal_move(coord(i + 1, j - 1), coord(i, j)))) {
        return ntmove(coord(i + 1, j - 1), coord(i, j));
    } else {
        return false;
    }
}
function intp(from, to) {
    i = to.x;
    j = to.y;
    n = (j > 0);
    s = (j < 7);
    e = (i < 7);
    w = (i > 0);
    if (n && e) ne = board[i + 1][j - 1]; else ne = null;
    if (n && w) nw = board[i - 1][j - 1]; else nw = null;
    if (s && e) se = board[i + 1][j + 1]; else se = null;
    if (s && w) sw = board[i - 1][j + 1]; else sw = null;
    eval(((j - from.y != 1) ? "s" : "n") + ((i - from.x != 1) ? "e" : "w") + "=0;");
    if ((sw == 0) && (integ(ne) == 1)) return false;
    if ((se == 0) && (integ(nw) == 1)) return false;
    if ((nw == 0) && (se == 1.1)) return false;
    if ((ne == 0) && (sw == 1.1)) return false;
    return true;
}
function init() {
    document.write("<table border=0 cellspacing=0 cellpadding=0 width=" + (sqd * 8 + 8) + "<tr><td><img src='img/dark.gif' width=" + (sqd * 8 + 8) + " height=4><br></td></tr>");
    for (var j = 0; j < 8; j++) {
        document.write("<tr><td><img src='img/dark.gif' width=4 height=" + sqd + ">");
        for (var i = 0; i < 8; i++) {
            if (ismov(i, j)) document.write("<a href='javascript:clicked(" + i + "," + j + ")'>");
            document.write("<img src='");
            if (board[i][j] == 1) document.write("img/plr1.gif"); else if (board[i][j] == -1) document.write("img/nt1.gif"); else if (ismov(i, j)) document.write("img/pale.gif"); else document.write("img/dark.gif");
            document.write("' width=" + sqd + " height=" + sqd + " name='case" + i + "" + j + "' border=0>");
            if (ismov(i, j)) document.write("</a>");
        }
        document.write("<img src='img/dark.gif' width=4 height=" + sqd + "></td></tr>");
    }
    document.write("<tr><td><img src='img/dark.gif' width=" + (sqd * 8 + 8) + " height=4><br></td></tr></table>");
}
function begin() {
    myeat = 0;
    youeat = 0;
    if (Math.round(Math.random() * 1) == 0) {
        mymov = false;
        ntai();
        cons("A new NeverCheckers game has started!<br>... NPC will play first.");
    } else {
        mymov = true;
        cons("A new NeverCheckers game has started!<br>... Human will play first.");
    }
}