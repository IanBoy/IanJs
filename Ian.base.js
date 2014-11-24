/**
 * Created by LiMengwen on 14-2-14.
 */
"use strict";
var Ian = {};
Ian.namespace = function(str){
    var arr = str.split("."),root = Ian;//first引用同地址
    for(var i=(arr[0]=="Ian"?1:0);i<arr.length;i++){
        root[arr[i]] = root[arr[i]] || {};
        //i == 1,arr[1] = "zoo",root == Ian,root["Zoo"] == null, root["Zoo"] = {}
        //i == 2,arr[2] = "Cat",root == Zoo,root["Cat"] == null, root["Cat"] = {}
        //赋值改变root对象引用地址,finally,root == Cat,true
        root = root[arr[i]];
    }
};

Ian.$ = jQuery;

/* Class 对象操作 继承拷贝 */
Ian.Lang = {
    /**
     * 对象深拷贝 递归调用
     * @param targetObj 拷贝目标对象
     * @param originalObj 原始对象
     * @returns 新原始对象
     */
    deepCopy:function(targetObj,originalObj){
        var t = targetObj,o = originalObj;
        if(t && o){
            for(var i in targetObj){
                if(targetObj.hasOwnProperty(i)){
                    o[i] = typeof t[i] === "object" ? this.deepCopy(t[i],{}) : t[i];
                }
            }
            return o;
        }
    },
    /**
     * Ecma Json解析版clone IE7-不兼容
     * @param obj
     * @returns {*}
     */
    cloneObj:function(obj){
        if(obj && typeof obj == "object"){
            return JSON.parse(JSON.stringify(obj));
        }
    },
    /**
     * 原型继承 非原型链
     * @param supConsFn 父类构造函数
     * @param subConsFn 子类构造函数
     * @param op 另外加入到子类的prototype属性
     */
    extend:function(supConsFn,subConsFn,op){
        var sup = supConsFn,sub = subConsFn,parms = op;
        if(sup && typeof sup === "function" && sub && typeof sub === "function"){
            for(var i in sup.prototype){
                sub.prototype[i] = sup.prototype.hasOwnProperty(i) ? sup.prototype[i] : undefined;
            }
            if(op && typeof op === "object"){
                for(var j in parms){
                    sub.prototype[j] = parms.hasOwnProperty(j) ? parms[j] : undefined;
                }
            }
        }
    }
}
Ian.log = function(msg){
    try{
        console.log(msg);
    }catch (err){
        throw new Error("No Logger Support =^_^=");
    }
}
Ian.Event = {
    getEventTarget:function(event){
        var e = window.event || event;
        return e.srcElement || e.target;
    },
    /**
     * 阻止事件冒泡
     * @param event
     */
    stop:function(event){
        //window.event(MouseEvent) 4 ie7- || e(EventObject) 4 chrom&firefox&ie8+
        var event = window.event || event;
        !document.all ? event.stopPropagation() : event.cancelBubble = true;
    }

}
Ian.namespace("Ian.Dom");
Ian.Dom.on = function(eventType,obj,handler){
    var o = typeof obj === "object" ? obj : undefined;
    if(o){
        !document.all ? o.addEventListener(eventType,handler) : o.attachEvent("on"+eventType,handler);
    }
}
Ian.Dom.off = function(eventType,obj,handler){
    var o = typeof obj === "object" ? obj : undefined;
    if(o &&  handler){
        !document.all ? o.removeEventListener(eventType,handler) : o.detachEvent("on"+eventType,handler);
    }
}
/**
 * 测试类
 */
Ian.namespace("Ian.Test.Lang");
Ian.Test.Lang = {
    original:Ian.Lang,
    testObj:{
        a:"helloworld",
        b:2,
        c:{
            c1:"dearGod",
            c2:function(){
            },
            c3:{
                name:"Ian",
                miss:{
                    dad:{
                        inside:"love"
                    },
                    mom:{
                        outside:"love"
                    }
                }
            },
            c4:[1,2,3,4]
        },
        d:function(){
        }
    },
    testDeepCopy:function(){
        var self = this;
        var o = self.original.deepCopy(self.testObj,{});
//        Ian.log(o);
//        Ian.log(o.c.c3 === self.testObj.c.c3);
//        self.testObj.c.c3 = {};
//        Ian.log(o.c.c3);
//        self.testObj.c.c4.push(99);
//        Ian.log(self.testObj);
//        Ian.log(o.c.c4);
        return o;
    },
    testCloneObj:function(){
        var self = this;
        var o = self.original.cloneObj(self.testObj);
//        Ian.log(o);
//        Ian.log(o.c.c3 === self.testObj.c.c3);
//        self.testObj.c.c3 = {};
//        Ian.log(o.c.c3);
//        self.testObj.c.c4.push(99);
//        Ian.log(self.testObj);
//        Ian.log(o.c.c4);
        return o;
    },
    testExtend:function(){
        function Person(name,sex,age){
            this.name = name;
            this.sex = sex;
            this.age = age;
        }
        Person.prototype.walk = function(){
            Ian.log("People can walk");
        }
        function Student(name,sex,age,className){
            var self = this;
            Person.call(self,name,sex,age);//调用父类构造器 让子类拥有父类的name,sex,age属性
            this.className = className;
        }
        /**
         * 用new对象赋值给原型 形成原型链 而非调用单纯父类prototype传递
         * 用new操作符后会把父类的prototype对象中的属性和方法放置在创建对象中成为私有属性，而对象的_proto_另外指向父类的Prototype完成原型链
         * @type {Person}
         */
        Student.prototype = new Person();

        Student.prototype.showClassName = function(){
            alert("ClassName is One");
        }
        console.log(Student.prototype);
        //Ian.Lang.extend(Person,Student,{showClassName:function(){}});
        var stu = new Student();
        console.log(stu);
        console.log(Student.prototype);
        console.log(Person.prototype);
    }
}
//Ian.Test.Lang.testDeepCopy();
//Ian.Test.Lang.testExtend();













