var snake = [[[1, 5], [1, 2, 5], [1, 2, 3, 5], [1, 2, 3, 4, 5]], [[6, 10], [6, 7, 10], [6, 7, 8, 10], [6, 7, 8, 9, 10]]];
var dead = [[[201, 203], [201, 202, 203], [201, 202, 202, 203], [201, 202, 202, 202, 203]], [[204, 206], [204, 205, 206], [204, 205, 205, 206], [204, 205, 205, 205, 206]]];
var snaketypes = [["", 2, 4], ["", 3, 4], ["", 4, 2], ["", 5, 1]];
var gridx = 18, gridy = 18;
var player = [], computer = [], playerssnakes = [], computerssnakes = [];
var playerlives = 0, computerlives = 0, playflag = true, statusmsg = "";
var playersss = 0;
var computersss = 0;
var preloaded = [];
function imagePreload() {
    var i, ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 101, 102, 103, 201, 202, 203, 204, 205, 206];
    for (i = 0; i < ids.length; ++i) {
        var img = new Image, name = "img/s" + ids[i] + ".gif";
        img.src = name;
        preloaded[i] = img;
    }
    window.status = "";
}
function setupPlayer(ispc) {
    var y, x;
    grid = [];
    for (y = 0; y < gridx; ++y) {
        grid[y] = [];
        for (x = 0; x < gridx; ++x) {
            grid[y][x] = [100, -1, 0];
        }
    }
    var snakeno = 0;
    var s;
    for (s = snaketypes.length - 1; s >= 0; --s) {
        var i;
        for (i = 0; i < snaketypes[s][2]; ++i) {
            var d = Math.floor(Math.random() * 2);
            var len = snaketypes[s][1], lx = gridx, ly = gridy, dx = 0, dy = 0;
            if (d == 0) {
                lx = gridx - len;
                dx = 1;
            } else {
                ly = gridy - len;
                dy = 1;
            }
            var x, y, ok;
            do {
                y = Math.floor(Math.random() * ly);
                x = Math.floor(Math.random() * lx);
                var j, cx = x, cy = y;
                ok = true;
                for (j = 0; j < len; ++j) {
                    if (grid[cy][cx][0] < 100) {
                        ok = false;
                        break;
                    }
                    cx += dx;
                    cy += dy;
                }
            } while (!ok);
            var j, cx = x, cy = y;
            for (j = 0; j < len; ++j) {
                grid[cy][cx][0] = snake[d][s][j];
                grid[cy][cx][1] = snakeno;
                grid[cy][cx][2] = dead[d][s][j];
                cx += dx;
                cy += dy;
            }
            if (ispc) {
                computerssnakes[snakeno] = [s, snaketypes[s][1]];
                computerlives++;
            } else {
                playerssnakes[snakeno] = [s, snaketypes[s][1]];
                playerlives++;
            }
            snakeno++;
        }
    }
    return grid;
}
function setImage(y, x, id, ispc) {
    if (ispc) {
        computer[y][x][0] = id;
        document.images["pc" + y + "_" + x].src = "img/s" + id + ".gif";
    } else {
        player[y][x][0] = id;
        document.images["ply" + y + "_" + x].src = "img/s" + id + ".gif";
    }
}
function showGardenPL() {
    var y, x;
    var s = "";
    for (y = 0; y < gridy; ++y) {
        for (x = 0; x < gridx; ++x) {
            s = s + '<a href="javascript:void(0);"><img name="ply' + y + '_' + x + '" src="img/s' + player[y][x][0] + '.gif"></a>';
        }
        s = s + '<br>';
    }
    document.getElementById("theGardenPL").innerHTML = s;
}
function showGardenNT() {
    var y, x;
    var s = "";
    for (y = 0; y < gridy; ++y) {
        for (x = 0; x < gridx; ++x) {
            s = s + '<a href="javascript:gridClick(' + y + ',' + x + ');"><img name="pc' + y + '_' + x + '" src="img/s100.gif"></a>';
        }
        s = s + '<br>';
    }
    document.getElementById("theGardenNT").innerHTML = s;
}
function gridClick(y, x) {
    if (playflag) {
        if (computer[y][x][0] < 100) {
            setImage(y, x, 103, true);
            var snakeno = computer[y][x][1];
            if (--computerssnakes[snakeno][1] == 0) {
                whacksnake(computer, snakeno, true);
                computersss--;
                document.getElementById("snakesNT").value = "" + computersss;
                if (--computerlives <= 0) {
                    updateScore(999999999);
                    playflag = false;
                    document.getElementById("startDiv").style.display = "block";
                    document.getElementById("restartDiv").style.display = "none";
                } else {
                }
            } else {
            }
            if (playflag) computerMove();
        } else if (computer[y][x][0] == 100) {
            setImage(y, x, 102, true);
            computerMove();
        }
    }
}
function computerMove() {
    var x, y, pass;
    var sx, sy;
    var selected = false;
    for (pass = 0; pass < 2; ++pass) {
        for (y = 0; y < gridy && !selected; ++y) {
            for (x = 0; x < gridx && !selected; ++x) {
                if (player[y][x][0] == 103) {
                    sx = x;
                    sy = y;
                    var nup = (y > 0 && player[y - 1][x][0] <= 100);
                    var ndn = (y < gridy - 1 && player[y + 1][x][0] <= 100);
                    var nlt = (x > 0 && player[y][x - 1][0] <= 100);
                    var nrt = (x < gridx - 1 && player[y][x + 1][0] <= 100);
                    if (pass == 0) {
                        var yup = (y > 0 && player[y - 1][x][0] == 103);
                        var ydn = (y < gridy - 1 && player[y + 1][x][0] == 103);
                        var ylt = (x > 0 && player[y][x - 1][0] == 103);
                        var yrt = (x < gridx - 1 && player[y][x + 1][0] == 103);
                        if (nlt && yrt) {
                            sx = x - 1;
                            selected = true;
                        } else if (nrt && ylt) {
                            sx = x + 1;
                            selected = true;
                        } else if (nup && ydn) {
                            sy = y - 1;
                            selected = true;
                        } else if (ndn && yup) {
                            sy = y + 1;
                            selected = true;
                        }
                    } else {
                        if (nlt) {
                            sx = x - 1;
                            selected = true;
                        } else if (nrt) {
                            sx = x + 1;
                            selected = true;
                        } else if (nup) {
                            sy = y - 1;
                            selected = true;
                        } else if (ndn) {
                            sy = y + 1;
                            selected = true;
                        }
                    }
                }
            }
        }
    }
    if (!selected) {
        do {
            sy = Math.floor(Math.random() * gridy);
            sx = Math.floor(Math.random() * gridx / 2) * 2 + sy % 2;
        } while (player[sy][sx][0] > 100);
    }
    if (player[sy][sx][0] < 100) {
        setImage(sy, sx, 103, false);
        var snakeno = player[sy][sx][1];
        if (--playerssnakes[snakeno][1] == 0) {
            whacksnake(player, snakeno, false);
            playersss--;
            document.getElementById("snakesPL").value = "" + playersss;
            if (--playerlives == 0) {
                knowYourEnemy();
                playflag = false;
                document.getElementById("startDiv").style.display = "block";
                document.getElementById("restartDiv").style.display = "none";
            }
        }
    } else {
        setImage(sy, sx, 102, false);
    }
}
function whacksnake(grid, snakeno, ispc) {
    var y, x;
    for (y = 0; y < gridx; ++y) {
        for (x = 0; x < gridx; ++x) {
            if (grid[y][x][1] == snakeno) {
                if (ispc) {
                    setImage(y, x, computer[y][x][2], true);
                } else {
                    setImage(y, x, player[y][x][2], false);
                }
            } else {
            }
        }
    }
}
function knowYourEnemy() {
    var y, x;
    for (y = 0; y < gridx; ++y) {
        for (x = 0; x < gridx; ++x) {
            if (computer[y][x][0] == 103) {
                setImage(y, x, computer[y][x][2], true);
            } else if (computer[y][x][0] < 100) {
                setImage(y, x, computer[y][x][0], true);
            } else {
            }
        }
    }
}
function loadGame() {
    playersss = 11;
    computersss = 11;
    document.getElementById("startDiv").style.display = "none";
    document.getElementById("restartDiv").style.display = "block";
    playflag = true;
    player = setupPlayer(false);
    computer = setupPlayer(true);
    showGardenNT();
    showGardenPL();
    updateStatus();
}
function endGame() {
    document.getElementById("startDiv").style.display = "block";
    document.getElementById("restartDiv").style.display = "none";
    playflag = false;
    knowYourEnemy();
}
imagePreload();