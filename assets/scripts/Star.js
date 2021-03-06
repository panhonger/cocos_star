// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        /*
        * 步骤五：1、设置星组规定主角距离星星多近时就可以完成收集
        * */
        // 星星和主角之间的距离小于这个数值时，就会完成收集
        pickRadius: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    /*
    *步骤八：2、利用 Game 组件中引用的 player 节点来判断距离
    * */
    getPlayerDistance: function () {
        // 根据 player 节点位置判断距离
        var playerPos = this.game.player.getPosition();
        // 根据两点位置计算两点之间距离
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    },

    onPicked: function() {
        // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();
        // 调用 Game 脚本的得分方法
        this.game.gainScore();//步骤九：3.1：加入 gainScore 的调用
        // 然后销毁当前星星节点
        this.node.destroy();

    },

    // update (dt) {},
    /*
    * 步骤八：3、添加每帧判断距离，如果距离小于 pickRadius 属性规定的收集距离，就执行收集行为
    * */
    update: function (dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        };


        /*
        *步骤十：1.5：为即将消失的星星加入简单的视觉提示效果
        * */
        // 根据 Game 脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    },
});
