(function(w){
    var FRAME_RATE=2,//精灵表播放速度
        COUNT_WIDTH=6,//序列帧每行图片数
        COUNT_HEIGHT=5,//序列每列图片数
        ITEM_SCALE=3.0//缩放比例

        var ITEM = function(img,mark){
            this.sigleX = img.width/COUNT_WIDTH;
            this.sigleY = img.height/COUNT_HEIGHT;
            //设定玩家初始位置
            this.x = Math.random()*(C_W_RIGHT-this.sigleY*ITEM_SCALE)-50;
            this.y = GROUND_H-this.sigleY*ITEM_SCALE/1.1;
            this.mark=mark;
            this.pre=0;
            this.state = "normal";
            this.init(img);
        }
    
        ITEM.prototype = {
            init:function(img){

                //动作序列设置
                var spriteSheet = new createjs.SpriteSheet({
                    "images":[img],
                    "frames":{"regX":0,"regY":1,"width":this.sigleX,"height":this.sigleY,"count":30},
                    "animations":{
                        "normal":{
                            frames:[0],
                            speed:0.8
                        },
                        "attack":{
                            frames:[,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29],
                            speed:1,
                            next:"normal"
                        }
                    }
                });
                this.sprite = new createjs.Sprite(spriteSheet , this.state);
                this.sprite.framerate = FRAME_RATE;
                this.sprite.setTransform(this.x, this.y, ITEM_SCALE, ITEM_SCALE);
                this.child = stage.addChild(this.sprite);
            },
    
            attack:function(){
                this.sprite.gotoAndPlay("attack");
                this.pre=0;
            },
    
            reset:function(){
                this.sprite.x = Math.random()*(C_W_RIGHT-this.sigleY*ITEM_SCALE)-50;
                this.sprite.y = GROUND_H-this.sigleY*ITEM_SCALE/1.1;
            },
    
            picsize:function(){
                return {
                    w:this.sigleX*ITEM_SCALE,
                    h:this.sigleY*ITEM_SCALE
                }
            },
        }
    
        w.createFlame = function(img,mark){
            return new ITEM(img,mark)
        };
})(window)