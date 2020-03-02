import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { GameService } from '../../services/game.service';
import { WebSocket } from '../../services/WebSocketAPI';

import { CardsPackage } from '../../models/CardsPackage';
import { Player } from 'src/app/models/Player';

@Component({
  selector: 'app-root',
  templateUrl: './menu.component.html',
  styleUrls: ['../../app.component.scss', './menu.component.scss']
})
export class MenuComponent implements OnInit {

  player: Player;
  gameIds: number[] = [];
  selectedGame: Number;
  cardsPackage: CardsPackage;
  ws: WebSocket;

  constructor(private gameService: GameService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.getGameIds();
    this.ws = new WebSocket(this, "/topic/hub");
    this.loadActivePlayer();
    if(this.player === undefined || this.player === null) this.openPlayerDialog();
  }

  onSelect(id) {
    this.selectedGame = id;
  }

  getGameIds(): void {
    this.gameService.getGameIdList().subscribe((data) => {
      this.gameIds = data;
    });
  }

  navigateTo() {
    this.openGame(this.selectedGame, this.player, null);
  }

  openDialog() {

    const maxId = Math.floor(Math.random() * 100000);
    const dialogRef = this.dialog.open(MenuDialog, {
      width: '80%',
      data: { selectedPackage: null, gameId: maxId + 1 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) this.openGame(result.gameId, this.player, result.selectedPackage);
    });
  }

  openPlayerDialog() {
    const dialogRef = this.dialog.open(PlayerDialog, {
      width: '50%',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.gameService.createPlayer(result.playerName).then(data => {
          this.player = data;
        })
      }
    });

  }

  handleMessage(message) {
    this.gameIds = JSON.parse(message);
  }

  /**
   * Open Game
   * 
   * Navigate to selected game and pass required data. Username must be defined.
   * 
   * @param gameId [Number] GameID to which user should be navigated
   * @param player [Player] Player data
   * @param gamePackage [CardsPackage] Selected cards package
   */
  private openGame(gameId: Number, player: Player, gamePackage: CardsPackage): void {
    if (player !== undefined && player.name !== '') {
      this.router.navigateByUrl(`ui/game/${gameId}`, { state: { data: { player: player, cards: gamePackage } } });
      this.ws._disconnect();
    }
  }

  //Coockies//
  private saveActivePlayer() {
    sessionStorage.setItem("activePlayer", JSON.stringify(this.player));
  }

  private loadActivePlayer() {
    this.player = JSON.parse(sessionStorage.getItem("activePlayer"));
  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'menu-dialog.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuDialog {

  cardPackages: CardsPackage[];

  constructor(
    public dialogRef: MatDialogRef<MenuDialog>, private gameService: GameService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.gameService.getGamePackages().subscribe((data) => {
      this.cardPackages = data;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'player-dialog.component.html',
  styleUrls: ['./menu.component.scss']
})
export class PlayerDialog {

  constructor(
    public dialogRef: MatDialogRef<PlayerDialog>, private gameService: GameService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
