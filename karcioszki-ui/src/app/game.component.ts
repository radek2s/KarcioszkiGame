import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameSession } from 'src/models/GameSession';
import { CardsPackage } from 'src/models/CardsPackage';
import { Player } from 'src/models/Player';
import { GameService } from './game.service';
import { WebSocket } from './WebSocketAPI';
import { map } from 'rxjs/operators';

/**
 * Game Component Class
 * 
 * Component to handle whole single game logic (with waiting lobby and running game)
 * This component provide gameSession variable to synchornize game state between other players.
 */
@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
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
  constructor(private route: ActivatedRoute, private gameService: GameService){ }
  
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
      //When data has been received from server - save them to gameSession variable
      this.gameSession = data;
      this.getDataFromRouter().then((routerData: any) => {
        if(routerData !== undefined) {
          this.activePlayer.name = routerData.player;
          setTimeout(() => { this.initializeGame(gameId, this.activePlayer, routerData.cards) }, 1000)
        }
      });
    })  
  }

  /**
   * Get Data from Active Route
   * Load player name and packageCard
   */
  getDataFromRouter(): Promise<Object>{
    return new Promise((resolve, reject) => {
      this.route.paramMap.pipe(map(()=> window.history.state.data)).subscribe((data) => {
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
      this.gameService.getGameSession(id).subscribe((gameSession:GameSession) => {
        resolve(gameSession)
      })
    })
  }

  //TODO: Exit from room method (delete from this gamesession this user)

  //TODO: Create selectable player update only for activePlayer (activePlayer can change only his properties)

  //TODO: GameLogic :D (when the start button starts a game!)

  ngOnDestroy(): void {
    this.webSocket._disconnect();
  }

  handleMessage(message) {
    this.gameSession = JSON.parse(message);
  }

  private initializeGame(gameId: Number, gamePlayer: Player, gamePackage: CardsPackage) {
    if(gamePlayer !== undefined && gamePlayer.name !== '') {
      console.debug("Creating player:" + gamePlayer.name)
      this.webSocket.sendMessage(`/app/game/hub/${gameId}/player/add`, gamePlayer)
    }
    if(gamePackage !== undefined) {
      console.debug("Creating gamePackage:" + gamePackage.packageName)
      this.webSocket.sendMessage(`/app/game/hub/${gameId}/card-package`, gamePackage);
    }
  }
}
