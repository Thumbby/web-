(function(w){
    var FRAME_RATE=2,//精灵表播放速度
        COUNT_WIDTH=4,//序列帧每行图片数
        COUNT_HEIGHT=4,//序列每列图片数
        ITEM_SCALE=1.5//缩放比例
        dir=1;//表示玩家方向，1为向右，-1为向左
        speed=0.15;

        var ITEM = function(img1,img2){
            this.sigleX = img1.width/COUNT_WIDTH;
            this.sigleY = img1.height/COUNT_HEIGHT;
            //设定玩家初始位置
            this.x = C_W_LEFT+this.sigleX*ITEM_SCALE*2;
            this.y = GROUND_H-this.sigleY*ITEM_SCALE;
            this.state = "normal_right";
            this.init(img1,img2);
        }
    
        ITEM.prototype = {
            init:function(img1,img2){

                //动作序列设置
                var spriteSheet = new createjs.SpriteSheet({
                    "images":[img1,img2],
                    "frames":{"regX":0,"regY":1,"width":this.sigleX,"height":this.sigleY,"count":32},
                    "animations":{
                        "normal_right":{
                            frames:[1],
                            speed:0.1
                        },
                        "normal_left":{
                            frames:[6],
                            speed:0.1
                        },
                        "move_right":{
                            frames:[3,2],
                            speed:0.1,
                            next:"normal_right"
                        },
                        "move_left":{
                            frames:[5,6],
                            speed:0.1,
                            next:"normal_left"
                        },
                        "attack_right":{
                            frames:[16,17,18],
                            speed:0.1,
                            next:"normal_right"
                        },
                        "attack_left":{
                            frames:[21,20,29],
                            speed:0.1,
                            next:"normal_left"
                        }
                    }
                });
                this.sprite = new createjs.Sprite(spriteSheet , this.state);
                this.sprite.framerate = FRAME_RATE;
                this.sprite.setTransform(this.x, this.y, ITEM_SCALE, ITEM_SCALE);
                this.child = stage.addChild(this.sprite);
            },
    
            update:function(){
                
            },
    
            reset:function(){
                this.sprite.x = C_W_LEFT+this.sigleX*ITEM_SCALE;
                this.sprite.y = GROUND_H-this.sigleY*ITEM_SCALE;
            },

            attack:function(){
                if(dir==1){
                    this.sprite.gotoAndPlay("attack_right");
                    dir=1;
                }
                else if(dir==-1){
                    this.sprite.gotoAndPlay("attack_left");
                    dir=-1;
                }
            },

            move:function(player_dir){
                if(player_dir==1){
                    this.sprite.gotoAndPlay("move_right");
                    if(this.sprite.x+50*speed<=C_W_RIGHT-this.sigleY*ITEM_SCALE){
                        this.sprite.x=this.sprite.x+50*speed;
                    }
                    dir=1;
                }
                else if(player_dir==-1){
                    this.sprite.gotoAndPlay("move_left");
                    if(this.sprite.x+50*speed>=C_W_LEFT){
                        this.sprite.x=this.sprite.x-50*speed;
                    }
                    dir=-1;
                }
            }
        }
    
        w.createPlayer = function(img1,img2){
            return new ITEM(img1,img2)
        };
})(window)