<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="author" content="Piotr Biesek">

  <link rel="stylesheet/less" type="text/css" href="style.less" />
  <link rel="stylesheet" type="text/css" href="jquery-ui.min.css" />

  <script type="text/javascript" src="less.min.js"></script>
  <script type="text/javascript" src="jquery-2.1.4.min.js"></script>
  <script type="text/javascript" src="jquery-ui.min.js"></script>
  <script type="text/javascript" src="script.js"></script>

  <title> Rajd do Niepodległości </title>
</head>
<body>

  <div id="container">
    <div id="top">
      <button id="game_start"> Nowa Gra </button>
      <button id="add_player"> + </button>
      <button id="remove_player"> - </button>
      <span class="info_area"> Ilośc Graczy: <span id="count_players"></span></span>
      <span class="info_area"> Ruch Gracza:  <span id="current_player"></span></span>
    </div>
    <div id="board">
      <ul class="cards">
        <li sign="0"></li>
        <li sign="1"></li>
        <li sign="2"></li>
        <li sign="3"></li>
      </ul>
    </div>
    <div id="statistics">
      <button id="accept"> Akceptuj </button>
      <button id="can_move"></button>
      <table>
        <tr class="name">
          <th> Gracz </th>
        </tr>
        <tr class="points">
          <th> Punkty </th>
        </tr>
        <tr class="count_cards">
          <th> Ilośc Kart </th>
        </tr>
      </table>
    </div>
    <div id="my_area">
      <ul class="cards">
      </ul>
    </div>
  </div>

</body>
</html>
