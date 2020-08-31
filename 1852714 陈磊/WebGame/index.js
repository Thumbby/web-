var stage, loader;
var C_W, C_H;
var GROUND_H;
var C_W_LEFT,C_W_RIGHT;
var canvas = document.getElementById("game-canvas");
var player,playerBloodBar,playerName,playerBlood,playerDamage,Attack,AttackSpeed;
var boss,bossBloodBar,bossName,bossBlood,bossDamage,bossAttackSpeed;
var flame1,flame2,flame3,flame4,flameArr=[];
var canplay=false;
var cheat;


function init(){

    //设置监听事件
    canvas.addEventListener("click",playerAttack);
    canvas.addEventListener
    window.addEventListener("keydown",playerMove,true);

    //设置舞台
    stage = new createjs.Stage("game-canvas");
    stage.canvas.width = document.body.clientWidth;
    stage.canvas.height = document.body.clientHeight;
    C_W = stage.canvas.width;
    C_H = stage.canvas.height;
    C_W_LEFT=0;
    C_W_RIGHT=canvas.width;
    GROUND_H=C_H-120;

    //关闭作弊模式
    cheat=0;

    //动画url
    var manifest = [
        {src:"img/player.png",id:"player1"},
        {src:"img/player2.png",id:"player2"},
        {src:"img/boss.png",id:"boss"},
        {src:"img/flame.png",id:"flame"}
    ]

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete" , handleComplete);
    loader.loadManifest(manifest);

    
    $(".title").show();
    $(".start").show();
    $(".info").show();
    
$(".start").click(function(){
    $(".start").hide();
    $(".title").hide();
    $(".info").hide();
    canplay=true;
})
}

function handleComplete() {

    //加载玩家图片
    var playerImage1=loader.getResult("player1");
    var playerImage2=loader.getResult("player2");
    player=createPlayer(playerImage1,playerImage2);

    //加载boss图片
    var bossImage=loader.getResult("boss");
    boss=new createjs.Bitmap(bossImage);
    boss.x=canvas.width/2-100;
    boss.y=C_H-245;
    stage.addChild(boss);

    //加载boss火焰图片
    var flameImage=loader.getResult("flame");
    flame1=createFlame(flameImage,1);
    flame2=createFlame(flameImage,2);
    flame3=createFlame(flameImage,3);
    flame4=createFlame(flameImage,4);
    flameArr.push(flame1,flame2,flame3,flame4);

    //玩家姓名
    playerName=new createjs.Text("Dumb","20px Times","white");
    playerName.x=45;
    playerName.y=20;
    stage.addChild(playerName);

    //玩家血量和攻击力
    playerBlood=100;

    playerBloodBar=new createjs.Shape();
    playerBloodBar.graphics.beginFill("red").drawRect(45,45,500,20);
    stage.addChild(playerBloodBar);

    playerDamage=20;
    Attack=0;//玩家是否攻击
    AttackSpeed=0;//玩家攻击间隔

    //boss名字
    bossName=new createjs.Text("BOSS","30px Times","white");
    bossName.x=100;
    bossName.y=C_H-90;
    stage.addChild(bossName);
    bossPhase=0;

    //boss血量
    bossBlood=1000;

    bossBloodBar=new createjs.Shape();
    bossBloodBar.graphics.beginFill("red").drawRect(100,C_H-50,C_W*0.9,20);
    stage.addChild(bossBloodBar);

    //boss攻击
    bossAttackSpeed=10;

    createjs.Ticker.timingMode=createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", handleTick);

}

function handleTick(){
    if(canplay){
        if(bossBlood<=0){
            winGame();
        }
        else if(playerBlood<=0){
            loseGame();
        }
        
        playMusic();

    //boss攻击
    bossAttackSpeed--;
    if(bossAttackSpeed==0){
        if(bossBlood>=700){
            var mark=parseInt(Math.random()*4);
            if(flameArr[mark].pre==0){
                flameArr[mark].pre=1;
                flameArr[mark].reset();
                flameArr[mark].attack();
                if(flameArr[mark].sprite.x-player.sprite.x>=-120&&flameArr[mark].sprite.x-player.sprite.x<=50){
                    if(playerBlood-10>0){
                        playerBlood-=10;
                    }
                    else{
                        playerBlood=0;
                    }
                }
            }
        bossAttackSpeed=100;
        }
        else if(bossBlood>=450&&bossBlood<700){
            for(var i=0;i<2;i++){
                var mark=parseInt(Math.random()*4);
                if(flameArr[mark].pre==0){
                    flameArr[mark].pre=1;
                    flameArr[mark].reset();
                    flameArr[mark].attack();
                    if(flameArr[mark].sprite.x-player.sprite.x>=-200&&flameArr[mark].sprite.x-player.sprite.x<=50){
                        if(playerBlood-10>0){
                            playerBlood-=10;
                        }
                        else{
                            playerBlood=0;
                        }
                    }
                }
            }
        bossAttackSpeed=80;
        }
        else if(bossBlood>=0&&bossBlood<450){
            for(var i=0;i<4;i++){
                var mark=parseInt(Math.random()*4);
                if(flameArr[mark].pre==0){
                    flameArr[mark].pre=1;
                    flameArr[mark].reset();
                    flameArr[mark].attack();
                    if(flameArr[mark].sprite.x-player.sprite.x>=-200&&flameArr[mark].sprite.x-player.sprite.x<=50){
                        if(playerBlood-10>0){
                            playerBlood-=10;
                        }
                        else{
                            playerBlood=0;
                        }
                    }
                }
            }
        bossAttackSpeed=50;
        }
    }
    //更新玩家血量
    playerBloodBar.graphics.beginFill("red").drawRect(45,45,playerBlood*5,20).endFill();
    playerBloodBar.graphics.beginFill("grey").drawRect(45+playerBlood*5,45,500-playerBlood*5,20).endFill();

    //玩家攻击间隔
    if(Attack==0.5){
        if(AttackSpeed>0){
            AttackSpeed--;
        }
        else if(AttackSpeed==0){
            Attack=0;
        }
    }

    //更新boss血量
    if(Attack==1){
        if((player.sprite.x-boss.x>=-100)&&(player.sprite.x-boss.x<=100)){
            if(bossBlood-playerDamage>0){
                bossBlood-=playerDamage;
            }
            else{
                bossBlood=0;
            }
        }
        Attack=0.5;
        AttackSpeed=50;
    }
    bossBloodBar.graphics.beginFill("red").drawRect(100,C_H-50,bossBlood*C_W*0.9/1000,20).endFill();
    bossBloodBar.graphics.beginFill("grey").drawRect(100+bossBlood*C_W*0.9/1000,C_H-50,C_W*0.9-bossBlood*C_W*0.9/1000,20).endFill();

    stage.update();
    }
}

function playerAttack(){
    if(Attack==0){
        player.attack();
        Attack=1;
    }
}

function playerMove(e){
    var keyID = e.keyCode ? e.keyCode :e.which;
    if(keyID === 39 || keyID === 68){
        player.move(1);
    }
    if(keyID === 37 || keyID === 65){
        player.move(-1);
    }
    if(keyID==83){
        if(canplay==false){
            canplay=true;
            Ticker.resume();
        }
        else{
            canplay=false;
            Ticker.pause();
        }
    }
    if(keyID==32){
        if(cheat==0){
            playerDamage=400;
            cheat=1;
        }
        else{
            playerDamage=20;
            cheat=0;
        }
    }
}

//输
function loseGame() {
    canPlay = false;
    $(".lose").show();
    $(".playagain").show();
    Ticker.pause();
}

//赢
function winGame() {
    canPlay = false;
    $(".win").show();
    $(".playagain").show();
    Ticker.pause();
}

$(".playagain").click(function(){
    $(".lose").hide();
    $(".win").hide();
    $(".playagain").hide();
    playAgain();
})


//再玩一次
function playAgain() {
    flameArr.forEach(function(i){
        i.reset();
    })

    player.reset();
    playerBlood=100;
    playerDamage=20;
    bossBlood=1000;
    bossAttackSpeed=10;

    Ticker.resume();

    canPlay = true;
}

//播放音乐
function playMusic() {
        var music1 = document.getElementById('phase1');
        var music2 = document.getElementById('phase2');
        var music3 = document.getElementById('phase3');

    window.addEventListener("keydown", function() {
        if(bossBlood>=700){
            music1.play();
        }
    
        else if(bossBlood>=450&&bossBlood<700){
            music1.pause();
            music2.play();
        }
    
        else if(bossBlood>=0&&bossBlood<450){
            music1.pause();
            music2.pause();
            music3.play();
        }
    })

}

init()

