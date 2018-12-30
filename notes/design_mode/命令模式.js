//命令模式是最简单和优雅的模式之一, 命令模式中的命令（command）指的是一个执行某些特定事情的指令
//解开请求调用者与请求接收者之间的耦合关系

//点击了按钮之后, 必须向某些负责具体行为的对象发送请求, 这些对象就是请求的接收者。
//但是目前并不知道接收者是什么对象, 也不知道接收者究竟会做什么
/*模拟传统面向对象语言的命令模式实现*/
let button1 = document.getElementById('button1');
let button2 = document.getElementById('button2');
let button3 = document.getElementById('button3');
function setCommand( button, command ){
	button.onclick = function(){
		command.execute();
	}
}

let menuBar = {
	refresh : function(){
		console.log('刷新菜单目录');
	}
}
let SubMenu = {
	add : function(){
		console.log('增加子菜单');
	},
	del : function(){
		console.log('删除子菜单');
	}
}
function RefreshMenuBarMenu( receiver ){
	this.receiver = receiver;
}
RefreshMenuBarMenu.prototype.execute = function(){
	this.receiver.refresh();
}
function AddSubMenuCommand( receiver ){
	this.receiver = receiver;
}
AddSubMenuCommand.prototype.execute = function(){
	this.receiver.add();
}
function DelSubMenuCommand( receiver ){
	this.receiver = receiver;
}
DelSubMenuCommand.prototype.execute = function(){
	this.receiver.del();
}
let refreshMenuBarCommand = new RefreshMenuBarCommand( MenuBar );
let addSubMenuCommand = new AddSubMenuCommand( SubMenu );
let delSubMenuCommand = new DelSubMenuCommand( SubMenu );
setCommand( button1, refreshMenuBarCommand );
setCommand( button2, addSubMenuCommand );
setCommand( button3, delSubMenuCommand );

/****************/
let ball = document.getElementById('ball');
let pos = document.getElementById('pos');
let moveBtn = document.getElementById('moveBtn');
let cancelBtn = document.getElementById('cancelBtn');
function MoveCommand( receiver, pos ){
	this.receiver = receiver;
	this.pos = pos;
	this.oldPos = null;
}
MoveCommand.prototype.execute = function(){
	this.receiver.start('left', this.pos, 1000, 'easeInout');
	// 记录小球开始移动前的位置
	this.oldPos = this.receiver.dom.getBoundingClientRect()[ this.receiver.propertyName ];
}
MoveCommand.prototype.undo = function(){
	this.receiver.start( 'left', this.oldPos, 1000, 'strongEaseOut' );
	// 回到小球移动前记录的位置
};
let moveCommand;
moveBtn.onclick = function(){
	let animate = new Animate( ball );
	moveCommand = new MoveCommand( animate, pos.value );
	moveCommand.execute();
}
cancelBtn.onclick = function(){
	moveCommand.undo(); // 撤销命令
};
/*播放录像*/
let Ryu = {
	attack : function(){
		console.log('攻击');
	},
	defense : function(){
		console.log('防守');
	},
	jump : function(){
		console.log('跳跃');
	},
	crouch : function(){
		console.log('蹲下')
	}
}
function makeCommand( receiver, state ){
	return function(){
		receiver[ state ]();
	}
}
let commands = {
	'119' : 'jump',     //w
	'115' : 'crouch',   //s
	'97' : 'defense',   //a
	'100' : 'attack'    //d
}
let commandStack = []; //保存命令的堆栈
document.onkeypress = function( ev ){
	let keyCode = ev.keyCode;
	let command = makeCommand( Ryu, commands[keyCode] );
	if( command ){
		command(); //执行命令
		commandStack.push( command ); //将刚刚执行的命令保存进堆栈
	}
}
document.getElementById('replay').onclick = function(){
	let command;
	while( command = commandStack.shift() ){
		command()
	}
}
