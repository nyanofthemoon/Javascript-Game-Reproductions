var i, j, ise, jse, imov = 0, jmov = 0, gover, totm, maxm, restart;
size = 10, level = 0;
lvlmax = new Array();
lvlmax[0] = 5;
lvlmax[1] = 10;
lvlmax[2] = 15;
solve = new Array(4);
for (i = 0; i < 4; i++) solve[i] = new Array();
Fld = new Array(size);
for (i = 0; i < size; i++) {
    Fld[i] = new Array(size);
}
Pic = new Array(5);
for (i = 0; i < 4; i++) {
    Pic[i] = new Image();
    Pic[i].src = "img/piece" + i + ".gif";
}

function init(isNew, l) {
    level = l;
    var ii, jj, vv;
    if ((imov != 0) || (jmov != 0)) return;
    for (ii = 0; ii < size; ii++) {
        for (jj = 0; jj < size; jj++) Fld[ii][jj] = 0;
    }
    gover = false;
    if (isNew) {
        maxm = lvlmax[level];
        ii = 0;
        do {
            solve[0][ii] = Math.floor(Math.random() * size);
            solve[1][ii] = Math.floor(Math.random() * size);
            solve[2][ii] = Math.floor(Math.random() * 3) - 1;
            solve[3][ii] = Math.floor(Math.random() * 3) - 1;
            vv = 0;
            if ((solve[2][ii] == 0) && (solve[3][ii] == 0)) vv++;
            if (ref(solve[0][ii] + solve[2][ii], solve[1][ii] + solve[3][ii]) < 0) vv++;
            for (jj = 0; jj < ii; jj++) {
                if (sim(ii, jj)) vv++;
            }
            if (vv == 0) ii++;
        } while (ii < maxm)
        restart = false;
    } else restart = true;
    for (ii = 0; ii < maxm; ii++) {
        ise = solve[0][ii];
        jse = solve[1][ii];
        imov = solve[2][ii];
        jmov = solve[3][ii];
        while (move(false));
    }
    totm = 0;
    ise = -1, jse = -1;
    imov = 0;
    jmov = 0;
    reftab();
    document.getElementById("preDiv").style.display = "none";
    document.getElementById("end1Div").style.display = "none";
    document.getElementById("end2Div").style.display = "none";
    document.getElementById("plaDiv").style.display = "block";
    document.gform.tot.value = "0";
    document.gform.max.value = "" + maxm;
}
function check() {
    var ii, jj;
    if (gover) return;
    for (ii = 0; ii < size; ii++) {
        for (jj = 0; jj < size; jj++) {
            if (Fld[ii][jj] != 0) return;
        }
    }
    gover = true;
    document.getElementById("plaDiv").style.display = "none";
    if (totm > maxm) {
        document.getElementById("end1Div").style.display = "block";
    } else {
        if (!restart) {
            document.getElementById("end2Div").style.display = "block";
            updateScore(999999999);
        }
    }
}
function forcend() {
    document.getElementById("end1Div").style.display = "none";
    document.getElementById("end2Div").style.display = "none";
    document.getElementById("plaDiv").style.display = "none";
    document.getElementById("preDiv").style.display = "block";
}
function board() {
    document.open("text/plain");
    for (j = 0; j < size; j++) {
        document.write("<tr>");
        for (i = 0; i < size; i++) document.write("<td><a href=\"javascript:sel(" + i + "," + j + ")\"><img src=img/piece0.gif border=0></a></td>");
        document.writeln("</tr>");
    }
    document.close();
}
function move(bb) {
    if ((imov == 0) && (jmov == 0)) {
        return;
    }
    var nn, mm;
    Fld[ise][jse] = 1 - Fld[ise][jse];
    nn = ise;
    mm = jse;
    ise += imov;
    jse += jmov;
    if (bb) refimg(nn, mm);
    if ((ise >= 0) && (ise < size) && (jse >= 0) && (jse < size)) {
        if (bb) refimg(ise, jse);
        return (true)
    } else {
        ise = -1;
        jse = -1;
        imov = 0;
        jmov = 0;
        totm++;
        if (bb) {
            document.gform.tot.value = "" + totm;
            document.gform.max.value = "" + maxm;
            check();
        }
        return (false);
    }
}
function sel(ii, jj) {
    var nn, mm;
    if (gover) return;
    if ((imov != 0) || (jmov != 0)) return;
    if (ise >= 0) {
        nn = ise;
        mm = jse;
        ise = ii;
        jse = jj;
        refimg(nn, mm);
    } else {
        ise = ii;
        jse = jj;
    }
    refimg(ii, jj);
}
function ref(nn, mm) {
    if (nn < 0) return (-1);
    if (nn >= size) return (-1);
    if (mm < 0) return (-1);
    if (mm >= size) return (-1);
    return (Fld[nn][mm]);
}
function refimg(ii, jj) {
    if ((ise == ii) && (jse == jj)) {
        document.images[size * jj + ii].src = Pic[Fld[ii][jj] + 2].src;
    } else {
        document.images[size * jj + ii].src = Pic[Fld[ii][jj]].src;
    }
}
function reftab() {
    var ii, jj;
    for (ii = 0; ii < size; ii++) {
        for (jj = 0; jj < size; jj++) document.images[size * jj + ii].src = Pic[Fld[ii][jj]].src;
    }
}
function mov(ddi, ddj) {
    if (ise < 0) return;
    if ((imov != 0) || (jmov != 0)) return;
    imov = ddi;
    jmov = ddj;
}
function sim(ii, jj) {
    if (((solve[2][ii] == solve[2][jj]) && (solve[3][ii] == solve[3][jj])) || ((solve[2][ii] == -solve[2][jj]) && (solve[3][ii] == -solve[3][jj]))) {
        var ddi = solve[0][ii] - solve[0][jj];
        var ddj = solve[1][ii] - solve[1][jj];
        if (solve[3][ii] * ddi == solve[2][ii] * ddj) return (true);
    }
    return (false);
}