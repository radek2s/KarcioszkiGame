import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameSession } from 'src/models/GameSession';
import { CardsPackage } from 'src/models/CardsPackage';
import { Player } from 'src/models/Player';
import { GameService } from './game.service';
import { WebSocket } from './WebSocketAPI';
import { map } from 'rxjs/operators';
import { Card } from 'src/models/Card';

/**
 * Game Component Class
 * 
 * Component to handle whole single game logic (with waiting lobby and running game)
 * This component provide gameSession variable to synchornize game state between other players.
 */
@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./app.component.scss', './game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  gameSession: GameSession;
  webSocket: WebSocket;
  activePlayer: Player = new Player();

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

  clearSessionGame(gameSession):void{
    console.log(gameSession);
    gameSession = null;
    this.router.navigate(['/hub']);
    //TODO: endGame
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
  }

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

  private updatePlayer(player) {
    this.activePlayer = player;
    this.saveActivePlayer();
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/player/update`, player);
  }

  private saveActivePlayer() {
    sessionStorage.setItem("activePlayer", JSON.stringify(this.activePlayer));
  }

  private loadActivePlayer() {
    this.activePlayer = JSON.parse(sessionStorage.getItem("activePlayer"));
  }

}
