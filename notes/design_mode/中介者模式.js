/*中介者模式的作用就是解除对象与对象之间的紧耦合关系。增加一个中介者对象后，所有的
相关对象都通过中介者对象来通信，而不是互相引用，所以当一个对象发生改变时，只需要通知
中介者对象即可。*/

//中介者模式的例子——泡泡堂游戏
//玩家数量为2
function Player(name) {
  this.name = name;
  this.enemy = null; //敌人
}

Player.prototype.win = function() {
  console.log(this.name + 'won');
};

Player.prototype.lose = function() {
  console.log(this.name + 'lost');
};

Player.prototype.die = function() {
  this.lose();
  this.enemy.win();
};

let player1 = new Player('皮蛋');
let player2 = new Player('小乖');

player1.enemy = player2;
player2.enemy = player1;

//为游戏增加队伍
let players = [];
function Player(name, teamColor) {
  this.partners = []; //队友列表
  this.enemies = []; //敌人列表
  this.state = 'live'; //玩家状态
  this.name = name; //角色名字
  this.teamColor = teamColor; //队伍颜色
}
Player.prototype.win = function() {
  console.log('winner : ' + this.name);
};
Player.prototype.lose = function() {
  console.log('loser : ' + this.name);
};
Player.prototype.die = function() {
  //玩家死亡
  let all_dead = true;
  this.state = 'dead';
  for (let i = 0, partner; (partner = this.partners[i++]); ) {
    //遍历队友列表
    if (partner.state !== 'dead') {
      all_dead = false;
      break;
    }
  }

  if (all_dead === true) {
    this.lose(); //通知自己游戏失败
    for (let i = 0, partner; (partner = this.partners[i++]); ) {
      //通知所有队友玩家游戏失败
      partner.lose();
    }
    for (let i = 0, enemy; (enemy = this.enemies[i++]); ) {
      //通知所有敌人游戏胜利
      enemy.win();
    }
  }
};
//定义工厂创建玩家
function playerFactory(name, teamColor) {
  let newPlayer = new Player(name, teamColor); //创建新玩家
  for (let i = 0, player; (player = players[i++]); ) {
    //通知所有的玩家, 有新角色加入
    if (player.teamColor === newPlayer.teamColor) {
      //如果是同一队玩家
      player.partners.push(newPlayer); //相互添加到队友列表
      newPlayer.partners.push(player);
    } else {
      //相互添加到敌人列表
      player.enemies.push(newPlayer);
      newPlayer.enemies.push(player);
    }
  }
  players.push(newPlayer);
  return newPlayer;
}
//红队：
var player1 = playerFactory('皮蛋', 'red'),
  player2 = playerFactory('小乖', 'red'),
  player3 = playerFactory('宝宝', 'red'),
  player4 = playerFactory('小强', 'red');
//蓝队：
var player5 = playerFactory('黑妞', 'blue'),
  player6 = playerFactory('葱头', 'blue'),
  player7 = playerFactory('胖墩', 'blue'),
  player8 = playerFactory('海盗', 'blue');

player1.die();
player2.die();
player4.die();
player3.die();

/*中介者模式进行改造*/
//中介者对象为playerDirector
function Player(name, teamColor) {
  this.name = name; //角色名字
  this.teamColor = teamColor; //队伍颜色
  this.state = 'alive'; //生存状态
}
Player.prototype.win = function() {
  console.log(this.name + 'won');
};
Player.prototype.lose = function() {
  console.log(this.name + 'lose');
};
//玩家死亡
Player.prototype.die = function() {
  this.state = 'dead';
  playerDirector.reciveMessage('playerDead', this); //给中介者发送消息, 玩家死亡
};
//移除玩家
Player.prototype.remove = function() {
  playerDirector.reciveMessage('removePlayer', this); //给中介者发送消息, 移除玩家
};
Player.prototype.changeTeam = function(color) {
  playerDirector.reciveMessage('changeTeam', this, color); //给中介者发送消息, 玩家换队
};
function playerFactory(name, teamColor) {
  let newPlayer = new Player(name, teamColor); // 创造一个新的玩家对象
  playerDirector.reciveMessage('addPlayer', newPlayer); // 给中介者发送消息，新增玩家
  return newPlayer;
}

let playerDirector = (function() {
  let players = {}; //保存所有玩家
  let operations = {}; //中介者可以执行的操作
  /****新增玩家******/
  operations.addPlayer = function(player) {
    let teamColor = player.teamColor; //玩家队伍颜色
    players[teamColor] = players[teamColor] || []; //如果该颜色的玩家未成立队伍, 则新成立一个队伍
    players[teamColor].push(player); //添加玩家进入队伍
  };

  /****移除玩家******/
  operations.removePlayer = function(player) {
    let teamColor = player.teamColor;
    let teamPlayers = players[teamColor] || []; //该队伍所有成员
    for (let i = teamPlayers.length - 1; i >= 0; i--) {
      if (teamPlayers[i] === player) {
        teamPlayers.splice(i, 1);
      }
    }
  };

  /****玩家换队******/
  operations.changeTeam = function(player, newTeamColor) {
    operations.removePlayer(player); //从原队伍删除
    player.teamColor = newTeamColor;
    operations.addPlayer(player); //添加进新的队伍
  };

  operations.playerDead = function(player) {
    //玩家死亡
    let teamColor = player.teamColor;
    let teamPlayers = players[teamColor];
    let add_dead = true;
    for (let i = 0, player; (player = teamPlayers[i++]); ) {
      if (player.state !== 'dead') {
        add_dead = false;
        break;
      }
    }
    if (add_dead) {
      //全部死亡
      for (let i = 0, player; (player = teamPlayers[i++]); ) {
        player.lose();
      }
      for (let color in players) {
        if (color !== teamColor) {
          let teamPlayers = players[color];
          for (let i = 0, player; (player = teamPlayers[i++]); ) {
            player.win();
          }
        }
      }
    }
  };

  let reciveMessage = function() {
    let message = Array.prototype.shift.call(arguments); //arguments 的第一个参数为消息名称
    operations[message].apply(this, arguments);
  };

  return {
    reciveMessage: reciveMessage,
  };
})();

//中介者模式 -- 购买商品
