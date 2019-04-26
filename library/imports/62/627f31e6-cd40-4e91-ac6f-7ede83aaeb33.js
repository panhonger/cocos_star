"use strict";
cc._RF.push(module, '627f3HmzUBOkaxvft6Dqusz', 'Game');
// scripts/Game.js

'use strict';

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
        * 步骤六：1、添加生成星星需要的属性
        * */
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },

        /*
        * 步骤九：2.1:添加分数显示 Label 的引用属性
        * */
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },

        /*
        * 步骤十一：2.1 添加得分音效
        * */
        // 得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    /*
    * 步骤七：1、 添加生成星星的逻辑
    * */
    onLoad: function onLoad() {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        /*
        * 步骤十：1.1：spawnNewStar 调用 之前 加入计时需要的变量声明
        * */
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 生成一个新的星星
        this.spawnNewStar();
        // 初始化计分
        this.score = 0;

        /* /!*
         * 步骤九：2.2：添加计分用的变量的初始化
         * *!/
         // 初始化计分
         this.score = 0;*/
    },
    spawnNewStar: function spawnNewStar() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());

        /*
        * 步骤八：1、保存了主角节点的引用
        * */
        // 在星星组件上暂存 Game 对象的引用
        newStar.getComponent('Star').game = this;

        /*
        * 步骤十：1.2：加入重置计时器的逻辑
        * */
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    },

    start: function start() {},


    // update (dt) {},
    /*
    * 步骤十：1.3：加入计时器更新和判断超过时限的逻辑
    * */
    update: function update(dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    /*
    * 步骤九：2.3： 更新 scoreDisplay Label 的文字
    * */
    gainScore: function gainScore() {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score;

        /*
          * 步骤十一：2.2 插入播放声音的代码
          * */
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    /*
    * 步骤十：1.4：游戏失败时重新加载场景
    * */
    gameOver: function gameOver() {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    }

});

cc._RF.pop();