var Phaser = Phaser || {};
var Platformer = Platformer || {};

var game = new Phaser.Game(800, 450, Phaser.AUTO);

//Preload everything!
game.state.add("InitalState", new Platformer.InitalState());

//Connect to the server
game.state.add("ConnectionState", new Connection.Socket());


//login with credentials
game.state.add("MenuState", new Platformer.MenuState());
game.state.add("CreateGameState", new Platformer.CreateGameState());
game.state.add("JoinGameState", new Platformer.JoinGameState());
game.state.add("GameOverState", new Platformer.GameOverState());

//LobbyState
game.state.add("LobbyState", new Platformer.LobbyState());


//offer the menu
// /game.state.add("MenuState", new Platformer.MenuState());


game.state.add("BootState", new Platformer.BootState());
game.state.add("LoadingState", new Platformer.LoadingState());
game.state.add("GameState", new Platformer.TiledState());

game.state.start("InitalState", true, false);
//"assets/levels/level1.json"
