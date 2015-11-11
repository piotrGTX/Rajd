var Card = function(vlaue_, sign_){
  this.sign = sign_;
  this.value = vlaue_;
};

var Player = function(name_){
  this.name = name_;
  this.cards = [];
  this.points = 0;
  this.count_cards = 0;
};

var Game = function(count_players_){
  const the_bigest_card = 12; // 0,1,2,3,4,5
  const count_of_stack = 3; // 0,1,2,3
  this.return_the_bigest = the_bigest_card;
  this.return_count_of_stack = count_of_stack;
  this.count_players = count_players_;
  this.current_player;
  this.players = [];
  this.player_cards; // this.players[this.current_player].cards;
  this.stack = [null,null,null,null];
  this.can_move;
  this.win = false;
  var g = this;

  var try_can_move = function(){
    for(var x in g.player_cards){
      if (g.player_cards[x] != null){
        if (g.player_cards[x].value == 0)
          return true;
        for (var y in g.stack){
          if (g.stack[y] != null && g.player_cards[x].sign == y &&
              g.player_cards[x].value-1 == g.stack[y].value)
            return true;
        } 
      }
    }
    return false;
  };
  var distribute = function(){
    // Tworzenie Tali
    var deck = [];
    for(var value=0; value<=the_bigest_card; value++)
      for(var sign=0; sign<=count_of_stack; sign++)
        deck.push(new Card(value,sign));
    // Mieszanie Talii
    for(var x in deck){
      var los = Math.floor(Math.random()*(deck.length-1));
      var pom = deck[x];
      deck[x] = deck[los];
      deck[los] = pom;
    }
    // Rozdawanie 
    for(var x in deck){
      g.players[x%g.count_players].cards.push(deck[x]); // Dodanie nowej karty
      g.players[x%g.count_players].count_cards += 1; // Zwiększanie licznika
      g.players[x%g.count_players].points -= 10; // Odjęcie punktów
    }
    // Sprawdzanie czy przy pomocy tych kart gracz może wykonać ruch
  };
  var create_players = function(){
    // Tworzenie Ggraczy
    for(var i=0; i<g.count_players; i++)
      g.players.push(new Player("#"+i));
    g.players[0].name = "TY";
    // Rozdawanie Kart
    distribute();
    // Ustawiania zmiennej pomocniczej na 0 gracza
    g.current_player = 0;
    g.player_cards = g.players[g.current_player].cards;
    g.can_move = try_can_move();
  };
  var change_points = function(val){
    g.players[g.current_player].points += val;
  };
  this.next_player = function(){
    if(this.players[this.current_player].count_cards == 0){
      change_points(70);
      this.win = true;
      this.game_start = false;
      alert("Koniec Gry !!! \n Wygrał gracz: "+this.players[this.current_player].name);
    }
    if(!this.win && !this.can_move){
      this.current_player++;
      this.current_player %= this.count_players;
      this.player_cards = this.players[this.current_player].cards;
      this.can_move = try_can_move();
      return true;
    }
    else 
      return false;
  };
  this.try_give_cards = function(card_index_, stack_index_){
    if(this.can_move && this.player_cards[card_index_] != null && this.player_cards[card_index_].sign == stack_index_ &&
      (this.player_cards[card_index_].value == 0 || (this.stack[stack_index_] != null && (this.player_cards[card_index_].value-1 == this.stack[stack_index_].value))))
    {
      this.stack[stack_index_] = this.player_cards[card_index_];
      this.player_cards[card_index_] = null;
      this.can_move = false;
      change_points(10);
      if(this.stack[stack_index_].value == the_bigest_card){
        change_points(50);
      } 
      this.players[this.current_player].count_cards -= 1;
      return true;
    }
    else
      return false;
  };
  // 
  // Inicjacja
  create_players();
};
var AI = function(gameView_){
  this.gameView = gameView_;
  this.game = this.gameView.game;
  this.play = function(){
    while(this.game.current_player != 0 && !this.game.win){
      this.gameView.update_all();
      if(!this.game.next_player() && !this.game.win){

        if(Math.floor(Math.random()*1)==0){
          // Metoda #1 Wyrzuca pierwszą od lewej
          for(var x in this.game.player_cards)
            if(this.game.player_cards[x] != null && this.game.try_give_cards(x,this.game.player_cards[x].sign))
              break;
        }
        else{
          // Metoda #2 Wyrzuca pierwszą od prawej 
          for(var x=this.game.player_cards.length-1; x>=0; x--)
            if(this.game.player_cards[x] != null && this.game.try_give_cards(x,this.game.player_cards[x].sign))
              break;
        }
      }
    }
  };
};

var GameView = function(){
  const max_count_players = 13;
  const min_connt_players = 1;
  var count_players = 3;
  this.game_start = false;
  this.game;
  var game_view = this;

  this.show_count_players = function(){
    $("#count_players").text(count_players);
  };
  this.show_current_player = function(val){
    $("#current_player").text(val);
  };
  this.craete_players_statistics = function(players){
    $("#statistics table td").remove();
    for(var x in players){
      $("#statistics table tr.name th").after("<td>"+players[x].name+"</td>");
      $("#statistics table tr.points th").after("<td>"+players[x].points+"</td>");
      $("#statistics table tr.count_cards th").after("<td>"+players[x].count_cards)
    }
  };
  this.update_players_statistics = function(players){
    for(var x in players){
      $("#statistics table tr.points td:eq("+(players.length-x-1)+")").text(players[x].points);
      $("#statistics table tr.count_cards td:eq("+(players.length-x-1)+")").text(players[x].count_cards);
    }
  };
  this.can_move_control_lamp = function(){
    $("#can_move").removeClass();
    if(this.game.current_player != 0)
      $("#can_move").addClass("orange");
    else if (!this.game.can_move)
      $("#can_move").addClass("red");
    else
      $("#can_move").addClass("green");
  };
  this.show_cards = function(cards){
    // alert("Karty: "+cards);
    $("#my_area .cards").empty();
    var pom = 0;
    for(var x in cards){
      if(cards[x] == null) pom++;
      else{
        $("#my_area .cards").append("<li></li>");
        $("#my_area .cards li:eq("+(x-pom)+")").text(cards[x].value);
        $("#my_area .cards li:eq("+(x-pom)+")").attr({"index": x, "sign": cards[x].sign, "value": cards[x].value});
        if(cards[x].value == this.game.return_the_bigest)
          $("#my_area .cards li:eq("+(x-pom)+")").attr({"the_biggest": true});
        else
          $("#my_area .cards li:eq("+(x-pom)+")").attr({"the_biggest": false});
      }
    }
    $("#my_area .cards li").draggable({ revert: true });
  };
  this.show_stack = function(cards){
    for(var x in cards)
      if(cards[x]==null){
        $("#board .cards li:eq("+x+")").text("");
        $("#board .cards li:eq("+x+")").attr({"value": null});
      }
      else{
        $("#board .cards li:eq("+x+")").text(cards[x].value);
        $("#board .cards li:eq("+x+")").attr({"value": cards[x].value});
        if(cards[x].value == this.game.return_the_bigest)
          $("#board .cards li:eq("+x+")").attr({"the_biggest": true});
        else
          $("#board .cards li:eq("+x+")").attr({"the_biggest": false});
      }
  };

  this.create_all = function(){
    this.show_current_player(this.game.current_player);
    this.craete_players_statistics(this.game.players);
    this.show_stack(this.game.stack);
    this.show_cards(this.game.player_cards);
    this.can_move_control_lamp();
  };
  this.update_all = function(){
    this.show_current_player(this.game.current_player);
    this.update_players_statistics(this.game.players);
    this.show_stack(this.game.stack);
    this.can_move_control_lamp();
  };

  $("#add_player").click(function(){
    if(count_players+1 <= max_count_players)
      count_players++;
    game_view.show_count_players();
  });
  $("#remove_player").click(function(){
    if(count_players-1 >= min_connt_players)
      count_players--;
    game_view.show_count_players();
  });
  $("#game_start").click(function(){
    if(!game_view.game_start){
      game_view.game = new Game(count_players);
      ai = new AI(game_view); 
      game_view.create_all();
      $(this).text("Reset");
      $("#add_player, #remove_player").attr("disabled",true);
    }
    else{
      $(this).text("Nowa Gra");
      $("#add_player, #remove_player").attr("disabled",false)
    }
    // Zmiana statsu gry
    game_view.game_start = !game_view.game_start;
  });
  $("#accept").click(function(){
    if(game_view.game.current_player == 0){
      if(game_view.game.can_move == true)
        alert("Wykonaj Ruch !");
      else{
        game_view.game.next_player();
        ai.play();
        game_view.update_all();
      }
    }
    else
      alert("Nie twój Ruch !");
  });

  $("#can_move").click(function(){
    alert(game_view.game.can_move);
  });
  //
  $("#board .cards li").droppable({
    over: function(event, ui){
      if(game_view.game.current_player == 0 && 
          game_view.game.try_give_cards(ui.draggable.attr("index"),$(this).attr("sign")))
      {
        ui.draggable.remove();
        game_view.update_all();
      }
    }
  });
  game_view.show_count_players();
  game_view.show_current_player("-");
};



$(document).ready(function(){
  var game_view = new GameView();
});
