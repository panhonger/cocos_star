"use strict";
cc._RF.push(module, '3ee7bj0OpZG94RPkqKxuBoO', 'Player');
// scripts/Player.js

"use strict";

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
/*
* 步骤一：编写组件属性
* 步骤二：编写跳跃和移动代码
* 步骤三：开始动作
* 步骤四：移动控制
* 步骤五：制作星星（添加一个叫做 Star 的脚本）
* 步骤六：添加游戏控制脚本（添加一个叫做 Game 的脚本）
* 步骤七：在随机位置生成星星（game.js)
* 步骤八：添加主角碰触收集星星的行为
* 步骤九：添加得分 1、添加分数文字（Label）  2、在 Game 脚本中添加得分逻辑   3、在 Star 脚本中调用 Game 中的得分逻辑
* 步骤十：失败判定和重新开始   1、为星星加入计时消失的逻辑
* 步骤十一：加入音效  1、跳跃音效  2、得分音效
* */
cc.Class({
    extends: cc.Component,

    properties: {
        /*
        * 步骤一：设置主角移动方式
        * */
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,

        /*
        * 步骤十一：1.1：添加引用声音文件资源的 jumpAudio 属性
        * */
        // 跳跃音效资源
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    /*
    *步骤二：编写跳跃和移动代码
    * */
    setJumpAction: function setJumpAction() {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());

        /*
        * 步骤十一：1.2：插入播放音效的回调，并通过添加 playJumpSound 方法来播放声音
        * */
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    /*
    * 步骤十一：1.3： 调用声音引擎播放声音
    * */
    playJumpSound: function playJumpSound() {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },
    // LIFE-CYCLE CALLBACKS:

    /*
    * 步骤四：1、用 A 和 D 来控制他的跳跃方向
    * */
    onKeyDown: function onKeyDown(event) {
        // set a flag when key pressed
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    },
    onKeyUp: function onKeyUp(event) {
        // unset a flag when key released
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    },


    // onLoad () {},
    /*
    * 步骤三：在 onLoad 方法里调用刚添加的 setJumpAction 方法，然后执行 runAction 来开始动作
    * */
    //onLoad 方法会在场景加载后立刻执行，所以我们会把初始化相关的操作和逻辑都放在这里面。
    onLoad: function onLoad() {
        // 初始化跳跃动作
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        /*
        * 步骤四：2、配合加入向左和向右加速的开关，以及主角当前在水平方向的速度；
        *         最后再调用 cc.systemEvent，在场景加载后就开始监听键盘输入
        * */
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    /*
    * 步骤四：3、配合取消键盘输入监听
    * */
    onDestroy: function onDestroy() {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    start: function start() {},


    // update (dt) {},
    /*
    * 步骤四：4、添加加速度、速度和主角当前位置的设置
    * */
    update: function update(dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;
    }
});

cc._RF.pop();