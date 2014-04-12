/**
 * Created by LiMengwen on 14-2-19.
 */
/**
 *
 * @param obj 移动元素
 * @param targetObj 拖拽元素
 * @constructor
 */
Ian.Drag = function(obj,targetObj){
    this.elem = obj;
    this.tElem = targetObj;
    this.disX = 0;
    this.disY = 0;
    this.elemW = this.elem && this.elem instanceof Ian.$ ? this.elem.width() : this.elem.offsetWidth;
    this.elemH = this.elem && this.elem instanceof Ian.$ ? this.elem.height() : this.elem.offsetHeight;
    this.init();
}
Ian.Drag.prototype = {
    constructor : Ian.Drag,//不默认指向Object构造函数 判断类型使用
    clientW : document.documentElement.clientWidth,
    clientH : document.documentElement.clientHeight,
    //注意直接绑定函数 this就指向document非原对象 所以一定要用闭包
    fnDown : function(e){
        var self = this;
        var oEvent = window.event || e;

        self.disX = self.elem && self.elem instanceof Ian.$ ?
            oEvent.clientX - self.elem.offset().left : oEvent.clientX - self.elem.offsetLeft;
        self.disY = self.elem && self.elem instanceof Ian.$ ?
            oEvent.clientY - self.elem.offset().top : oEvent.clientY - self.elem.offsetTop;

        if(self.elem instanceof Ian.$){
            $(document).on('mousemove',function(e){
                self.fnMove(e);
            });
            $(document).mouseup(function(){
                self.fnUp();
            })
        }else{
            document.onmousemove = function(e){
                self.fnMove(e);
            };
            document.onmouseup = function(){
                self.fnUp();
            }
        }
    },
    fnMove : function(e){
        var self = this,
            oEvent = window.event || e;
        var left = oEvent.clientX - self.disX,
            top =  oEvent.clientY - self.disY;

        left<0 ? left=0 : left;
        left>self.clientW-self.elemW ? left=self.clientW-self.elemW : left;
        top<0 ? top=0 : top;
        top>self.clientH-self.elemH ? top=self.clientH-self.elemH : top;

        if(self.elem instanceof Ian.$){
            self.elem.css({"left":left + "px","top":top + "px"});
        }else{
            self.elem.style.left = left + "px";
            self.elem.style.top = top + "px";
        }
    },
    fnUp : function(){
        if($(document)){
            $(document).off();
        }
        document.onmouseup = null;
        document.onmousemove = null;
    },
    init : function(){
        var self = this,
            elem = typeof self.elem === "object" ? self.elem : undefined;
        if(!elem){
            return false;
        }
        var tElem = self.tElem ? self.tElem : elem;
        //if element is an of jQuery 's object
        if(elem instanceof Ian.$){
            tElem.on("mousedown",function(e){
                self.fnDown(e);
            })
        }else{
            tElem.onmousedown = function(e){
                self.fnDown(e);
            }
            return false;
        }
    }
}

window.onload = function(){
    var oDiv = document.getElementById("div1");
    var oDiv2 = document.getElementById("div2");
    var oH3 = document.getElementById("h3");

    //new Ian.Drag($("#div1"),$(".h3"));
    new Ian.Drag(oDiv2);
    new Ian.Drag(oDiv,oH3);
    //console.log(drag instanceof Object);
    //console.log(Ian.Drag.prototype.constructor);
}

