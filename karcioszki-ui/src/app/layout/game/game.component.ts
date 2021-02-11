import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { GameService } from '../../services/game.service';
import { WebSocket } from '../../services/WebSocketAPI';
import { GameSession } from '../../models/GameSession';
import { CardsPackage } from '../../models/CardsPackage';
import { Player } from '../../models/Player';
import { Card } from '../../models/Card';
import { PlayerService } from 'src/app/services/player.service';
import { MatDialog } from '@angular/material/dialog';
import { GameSummaryDialog } from 'src/app/layout/dialogs/game-summary-dialog.component';

/**
 * Game Component Class
 *
 * Component to handle whole single game logic (with waiting lobby and running game)
 * This component provide gameSession variable to synchornize game state between other players.
 */
@Component({
  selector: 'game',
  template: `<h1></h1>`,
  // templateUrl: './game.component.html',
  styleUrls: ['../../karcioszki.style.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  gameSession: GameSession;
  webSocket: WebSocket;
  validateGame = true;
  cardStatistics = {
    winner: undefined,
    remainingRed: 0,
    reaminingBlue: 0
  };

  _develop = true;
  _gameStartedFlag = false;

  /**
   * Create a new Game Component
   *
   * @param route - Currently opened Route (address in url)
   * @param gameService - REST methods to fetch data from remote server
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameService: GameService,
    public playerService: PlayerService,
    private gameSummaryDialog: MatDialog
  ) { }

  /**
   * Method invoked when component is created
   *
   * Initialize component variables
   */
  ngOnInit(): void {
    this.gameSession = new GameSession();
    const gameId = +this.route.snapshot.paramMap.get('id');
    this.webSocket = new WebSocket(this, `/topic/hub/${gameId}`);
    this.getDataFromApi(gameId).then((data: GameSession) => {
      this.gameSession = data;
      this.getDataFromRouter().then((routerData: any) => {
        if (routerData !== undefined) {
          setTimeout(() => { this.initializeGame(gameId, this.playerService.getPlayer(), routerData.cards, routerData.cardCount); }, 1000);
        }
      });
    });
  }

  /**
   * Get Data from Active Route
   * Load PackageCard and card count
   */
  getDataFromRouter(): Promise<object> {
    return new Promise((resolve, reject) => {
      this.route.paramMap.pipe(map(() => window.history.state.data)).subscribe((data) => {
        resolve(data);
      });
    });
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
        resolve(gameSession);
      });
    });
  }

  changeTeam(player): void {
    if (player.id === this.playerService.getPlayer().id) {
      player.team = player.team === 0 ? 1 : 0;
      this.updatePlayer(player);
    }
  }

  changeLeaderStatus(player): void {
    if (player.id === this.playerService.getPlayer().id) {
      if (player.leader === undefined) {
        player.leader = false;
      }
      player.leader = !player.leader;
      this.updatePlayer(player);
    }
  }

  selectedCard(card: Card, event) {
    if (!card.selected) {
      card.selected = true;
      this.updateGame(card.color);
    }

    // TODO: Card clicked logic - update points for team
  }

  startGameSession(): void {
    this.startGame();
  }

  ngOnDestroy(): void {
    if (this.webSocket) {
      this.webSocket._disconnect();
    }
  }

  handleMessage(message) {
    // debugger
    this.gameSession = JSON.parse(message);
    if (this._develop) {
      this.validateGame = false;
    } else {
      this.validateGame = this.validateGameStatus();
    }
    this.excludeActivePlayer(this.playerService.getPlayer());
    if (this.gameSession.gameState === 2 || this.gameSession.gameState === 3 || this.gameSession.gameState === 4) {
      this.gameSummaryDialog.open(GameSummaryDialog, {
        data: { winner: this.gameSession.gameState, activeTeam: this.playerService.getPlayer().team }
      });
    }
    if (this.gameSession.started && !this._gameStartedFlag) {

      this._gameStartedFlag = true;
    }
  }


  // --- WebSocket GameState ---//
  private initializeGame(gameId: number, gamePlayer: Player, gamePackage: CardsPackage, cardCount: number) {
    if (gamePlayer !== undefined && gamePlayer.name !== '') {
      this.webSocket.sendMessage(`/app/game/hub/${gameId}/player/add`, gamePlayer);
    }
    if (gamePackage !== null) {
      this.webSocket.sendMessage(`/app/game/hub/${gameId}/card-package`, gamePackage);
    }
    if (cardCount !== null) {
      this.webSocket.sendMessage(`/app/game/hub/${gameId}/card-count`, cardCount);
    }
  }

  private updateGame(cardColor) {


    switch (this.validateColor(cardColor, this.playerService.getPlayer().team)) {
      case -1:
        this.endGame('black');
        break;
      case 0:
        this.gameSession.gameCardStatistics.cardToGuess -= 1;
        if (this.gameSession.gameCardStatistics.cardToGuess <= 0) {
          if (this.playerService.getPlayer().team === 0) {
            if (this.gameSession.gameCardStatistics.redBonusCards > 0) {
              this.gameSession.gameCardStatistics.redBonusCards = 0;
              this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/update`, this.gameSession);
            } else {
              this.endTurn();
            }
          }
          if (this.playerService.getPlayer().team === 1) {
            if (this.gameSession.gameCardStatistics.blueBounsCards > 0) {
              this.gameSession.gameCardStatistics.blueBounsCards = 0;
              this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/update`, this.gameSession);
            } else {
              this.endTurn();
            }
          }
        } else {
          this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/update`, this.gameSession);
        }
        break;
      case 1:
        this.endTurn();
        break;
      case 2:
        this.endGame('blue');
        break;
      case 3:
        this.endGame('red');
        break;
    }
  }

  leaderSelect(cardNumber) {
    this.gameSession.gameCardStatistics.cardToGuess = cardNumber;
    this.leaderStart();
  }

  private endTurn() {
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/turn`, this.gameSession);
  }

  private leaderStart() {
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/leader`, this.gameSession);
  }

  private startGame() {
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/start`, undefined);
  }

  private endGame(color: string) {
    this.cardStatistics.winner = color;
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/end`, color);
  }

  private exitGame() {
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/player/exit`, this.playerService.getPlayer());
    this.router.navigateByUrl('/ui');
    this.webSocket._disconnect();
  }

  private updatePlayer(player) {
    this.playerService.setPlayer(player);
    this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/player/update`, player);
  }

  // --- Utilities --- //

  /**
   * Check if is button should be disabled (enough players to start the game)
   * Validate all contitions
   */
  private validateGameStatus() {
    const minPlayerCount = 4;

    const playerCount = this.gameSession.players.length;
    let redLeaderCount = 0;  // TeamID 0
    let redNonLeaderCount = 0;  // TeamID 0
    let blueLeaderCount = 0; // TeamID 1
    let blueNonLeaderCount = 0; // TeamID 1

    this.gameSession.players.forEach(player => {
      if (player.leader === true) {
        if (player.team === 0) {
          redLeaderCount = redLeaderCount + 1;
        } else {
          blueLeaderCount = blueLeaderCount + 1;
        }
      } else {
        if (player.team === 0) {
          redNonLeaderCount = redLeaderCount + 1;
        } else {
          blueNonLeaderCount = blueLeaderCount + 1;
        }
      }
      console.log(redNonLeaderCount, redLeaderCount, blueNonLeaderCount, blueLeaderCount);
    });


    if (playerCount >= minPlayerCount) {
      if (redLeaderCount === 1 && blueLeaderCount === 1 && redNonLeaderCount >= 1 && blueNonLeaderCount >= 1) {
        return false;
      }
    }
    return true;
  }


  /**
   * Remove from gameSession active player to display list of
   * players without duplicates. Compare by unique ID
   *
   * @param activePlayer Active Player Object
   */
  private excludeActivePlayer(activePlayer) {
    this.gameSession.players = this.gameSession.players.filter((player) => {
      return player.id !== activePlayer.id;
    });
  }

  /**
   *
   * @param cardColor - Color of the card
   * @param playerTeam - Number of player team
   *
   * Return codes:
   * -1 if black card color
   * 0 if just update a game
   * 1 to change a turn
   * 2 to win as a blue
   * 3 to win as a red
   */
  private validateColor(cardColor, playerTeam) {
    if (cardColor === 'blue') {
      this.gameSession.gameCardStatistics.remainingBlueCards -= 1;
      if (this.gameSession.gameCardStatistics.remainingBlueCards === 0) {
        return 2;
      }
      if (playerTeam === 0) {
        this.gameSession.gameCardStatistics.redBonusCards = 1;
        return 1;
      }
    } else if (cardColor === 'red') {
      this.gameSession.gameCardStatistics.remainingRedCards -= 1;
      if (this.gameSession.gameCardStatistics.remainingRedCards === 0) {
        return 3;
      }
      if (playerTeam === 1) {
        this.gameSession.gameCardStatistics.blueBounsCards = 1;
        return 1;
      }
    } else if (cardColor === 'black') {
      return -1;
    } else if (cardColor === 'orange') {
      return 1;
    }
    return 0;
  }

  public getCardCountSelected(cardCount) {
    if (this.gameSession.gameCardStatistics.cardToGuess === cardCount) {
      return {'background-color' : 'rgb(59, 138, 59)'};
    }
    return null;
  }

}
