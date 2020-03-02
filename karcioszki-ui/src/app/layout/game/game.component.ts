import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { GameService } from '../../services/game.service';
import { WebSocket } from '../../services/WebSocketAPI';
import { GameSession } from '../../models/GameSession';
import { CardsPackage } from '../../models/CardsPackage';
import { Player } from '../../models/Player';
import { Card } from '../../models/Card';

/**
 * Game Component Class
 * 
 * Component to handle whole single game logic (with waiting lobby and running game)
 * This component provide gameSession variable to synchornize game state between other players.
 */
@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['../../app.component.scss', './game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  gameSession: GameSession;
  webSocket: WebSocket;
  activePlayer: Player = new Player();
  validateGame: boolean = true;
  cardStatistics = {
    remainingRed: 0,
    reaminingBlue: 0
  };

  _develop: boolean = false;
  _gameStartedFlag: boolean = false;

  /**
   * Create a new Game Component
   * 
   * @param route - Currently opened Route (address in url)
   * @param gameService - REST methods to fetch data from remote server
   */
  constructor(private route: ActivatedRoute, private gameService: GameService, private router: Router) { }

  /**
   * Method invoked when component is created
   * 
   * Initialize component variables
   */
  ngOnInit(): void {
    this.gameSession = new GameSession();
    let gameId = +this.route.snapshot.paramMap.get('id');
    this.webSocket = new WebSocket(this, `/topic/hub/${gameId}`);

    this.getDataFromApi(gameId).then((data: GameSession) => {
      this.gameSession = data;
      this.getDataFromRouter().then((routerData: any) => {
        if (routerData !== undefined) {
          this.activePlayer.name = routerData.player;
          this.activePlayer.leader = false;
          this.activePlayer.team = 0;
          this.saveActivePlayer();
          setTimeout(() => { this.initializeGame(gameId, this.activePlayer, routerData.cards) }, 1000)
        } else {
          this.loadActivePlayer();
        }
      });
    })
  }

  /**
   * Get Data from Active Route
   * Load player name and packageCard
   */
  getDataFromRouter(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.route.paramMap.pipe(map(() => window.history.state.data)).subscribe((data) => {
        resolve(data);
      })
    })
  }

  /**
   * Get data from REST API
   * 
   * Fetch GameSession json object from remote server
   * @param id - GameSession ID
   */
  getDataFromApi(id): Promise<GameSession> {
    return new Promise((resolve, reject) => {
      this.gameService.getGameSession(id).subscribe((gameSession: GameSession) => {
        resolve(gameSession)
      })
    })
  }

  //TODO: Exit from room method (delete from this gamesession this user)

  //TODO: GameLogic :D (when the start button starts a game!)

  changeTeam(player): void {
    console.debug(player);
    if (player.name === this.activePlayer.name) {
      player.team = player.team == 0 ? 1 : 0;
      this.updatePlayer(player);
    }
  }

  changeLeaderStatus(player): void {
    if (player.name === this.activePlayer.name) {
      if(player.leader === undefined) {
        player.leader = false;
      }
      player.leader = !player.leader;
      this.updatePlayer(player);
    }
  }

  selectedCard(card:Card, event) {
    card.selected=true;
    if(card.color === "black") {
      this.endGame()
    }

    //odliczanie zaznaczonych kart z koloru
    if(card.color === "blue"){
      this.cardStatistics.reaminingBlue -= 1;
      if(this.cardStatistics.reaminingBlue == 0){
        this.endGame();
      }
    }
    if(card.color === "red"){
      this.cardStatistics.remainingRed -= 1;
      if(this.cardStatistics.remainingRed == 0){
        this.endGame();
      }
    }

    console.debug(this.cardStatistics, this.gameSession);


    //TODO: Card clicked logic - update points for team
  }

  

  startGameSession(): void {
    this.startGame();
  }

  ngOnDestroy(): void {
    this.webSocket._disconnect();
  }

  handleMessage(message) {
    this.gameSession = JSON.parse(message);
    if(this._develop) {
      this.validateGame = false;
      console.debug(this._gameStartedFlag)
      console.debug(this.gameSession)
    } else {
      this.validateGame = this.validateGameStatus()
    }
    this.excludeActivePlayer(this.activePlayer);
    if(this.gameSession.gameState == 2) {
      alert("Game Over!");
    }
    if(this.gameSession.started && !this._gameStartedFlag) {
      this.countCardsByColor();
      this._gameStartedFlag = true;
    }
  }



  //--- WebSocket GameState ---//
  private initializeGame(gameId: Number, gamePlayer: Player, gamePackage: CardsPackage) {
    if (gamePlayer !== undefined && gamePlayer.name !== '') {
      this.webSocket.sendMessage(`/app/game/hub/${gameId}/player/add`, gamePlayer)
    }
    if (gamePackage !== undefined) {
      this.webSocket.sendMessage(`/app/game/hub/${gameId}/card-package`, gamePackage);
    }
  }

  private updateGame() {
    console.debug("Next turn - sending gameSesstion: " + this.gameSession.gameState);
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/turn`, this.gameSession);
  }

  private startGame() {
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/start`, undefined);
  }

  private endGame() {
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/end`, this.gameSession);
  }

  private exitGame() {
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/player/exit`, this.activePlayer);
    this.router.navigateByUrl('/ui')
    this.webSocket._disconnect();
  }

  private updatePlayer(player) {
    this.activePlayer = player;
    this.saveActivePlayer();
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/player/update`, player);
  }

  //Coockies//
  private saveActivePlayer() {
    sessionStorage.setItem("activePlayer", JSON.stringify(this.activePlayer));
  }

  private loadActivePlayer() {
    this.activePlayer = JSON.parse(sessionStorage.getItem("activePlayer"));
  }

  // --- Utilities --- //

  /**
   * Check if is button should be disabled (enough players to start the game)
   * Validate all contitions
   */
  private validateGameStatus() {
    const minPlayerCount = 4;

    let playerCount = this.gameSession.players.length;
    let redLeaderCount = 0;  //TeamID 0
    let redNonLeaderCount = 0;  //TeamID 0
    let blueLeaderCount = 0; //TeamID 1
    let blueNonLeaderCount = 0; //TeamID 1

    this.gameSession.players.forEach(player => {
      if(player.leader == true) {
        if(player.team == 0) {
          redLeaderCount = redLeaderCount + 1;
        } else {
          blueLeaderCount = blueLeaderCount + 1;
        }
      }else{
        if(player.team == 0) {
          redNonLeaderCount = redLeaderCount + 1;
        } else {
          blueNonLeaderCount = blueLeaderCount + 1;
        }
      }
      console.log(redNonLeaderCount, redLeaderCount, blueNonLeaderCount, blueLeaderCount);
    });

    if(playerCount >= minPlayerCount) {
      if(redLeaderCount === 1 && blueLeaderCount === 1 && redNonLeaderCount >= 1 && blueNonLeaderCount >= 1) {
        return false;
      }
    }
    return true;
  }


  countCardsByColor(){
    this.gameSession.gameCards.forEach(card => {
      if (card.color=='red'){
        this.cardStatistics.remainingRed += 1;
      }else if(card.color=='blue'){
        this.cardStatistics.reaminingBlue += 1;
      }
    });
  }


  /**
   * Remove from gameSession active player to display list of
   * players without duplicates
   * 
   * @param activePlayer Active Player Object
   */
  private excludeActivePlayer(activePlayer) {
    this.gameSession.players = this.gameSession.players.filter(function(player) {
      return player.name !== activePlayer.name;
    })
  }


}
