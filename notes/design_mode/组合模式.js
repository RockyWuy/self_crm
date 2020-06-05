/*
 * @Author: rockyWu
 * @Date: 2018-12-30 11:28:44
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-06-02 15:03:19
 */

//组合模式
//组合模式就是用小的子对象来构建更大的对象, 而这些小的子对象本身也许是由更小的"孙对象"构成的
/*宏命令中包含了一组子命令, 它们组成了一个树形结构, 这里是一棵结构非常简单的树*/
let closeCommand = {
  execute: function() {
    console.log('关门');
  },
};
let openPcCommand = {
  execute: function() {
    console.log('开电脑');
  },
};
let openQQCommand = {
  execute: function() {
    console.log('登录QQ');
  },
};
function MarcoCommand() {
  return {
    commandList: [],
    add: function(command) {
      this.commandList.push(command);
    },
    execute: function() {
      for (let i = 0, command; (command = this.commandList[i++]); ) {
        command.execute();
      }
    },
  };
}
let macroCommand = new MarcoCommand();
macroCommand.add(closeCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQCommand);
macroCommand.execute();

//组合模式的例子——扫描文件夹
function Folder(name) {
  this.name = name;
  this.parent = null;
  this.files = [];
}
Folder.prototype.add = function(file) {
  file.parent = this;
  this.files.push(file);
};
Folder.prototype.scan = function() {
  console.log('开始扫描文件夹 : ' + this.name);
  for (let i = 0, file, files = this.files; (file = files[i++]); ) {
    file.scan();
  }
};
Folder.prototype.remove = function() {
  if (!this.parent) {
    return;
  }
  for (let files = this.parent.files, l = files.length - 1; l >= 0; l--) {
    let file = files[l];
    if (file === this) {
      files.splice(l, 1);
    }
  }
};
function File(name) {
  this.name = name;
}
File.prototype.add = function() {
  throw new Error('文件下面不能添加文件');
};
File.prototype.scan = function() {
  console.log('开始扫描文件 : ' + this.name);
};
//组合模式不是父子关系
//对叶对象操作的一致性
//双向映射关系
//用职责链模式提高组合模式性能
