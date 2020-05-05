import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { GameService } from '../../services/game.service';
import { WebSocket } from '../../services/WebSocketAPI';

import { CardsPackage } from '../../models/CardsPackage';
import { Player } from 'src/app/models/Player';
import { PlayerService } from 'src/app/services/player.service';
import { SimpleInputDialog } from 'src/app/widgets/dialogs/simpleInput.dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './menu.component.html',
  styleUrls: ['../../app.component.scss']
})
export class MenuComponent implements OnInit {

  gameIds: number[] = [];
  cardsPackage: CardsPackage;
  ws: WebSocket;

  constructor(private gameService: GameService, private playerService: PlayerService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.getGameIds();
    this.ws = new WebSocket(this, "/topic/hub");
    if(this.playerService.getPlayer === undefined || this.playerService.getPlayer() === null) {
      this.openPlayerDialog();
    }
  }

  getGameIds(): void {
    this.gameService.getGameIdList().subscribe((data) => {
      this.gameIds = data;
    });
  }

  navigateTo(id) {
    this.openGame(id, this.playerService.getPlayer(), null, null);
  }

  openDialog() {

    const maxId = Math.floor(Math.random() * 100000);
    const dialogRef = this.dialog.open(MenuDialog, {
      width: '80%',
      data: { selectedPackage: null, gameId: maxId + 1, cardCount: 15 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) this.openGame(result.gameId, this.playerService.getPlayer(), result.selectedPackage, result.cardCount);
    });
  }

  openPlayerDialog() {
    const dialogRef = this.dialog.open(PlayerDialog, {
      width: '50%',
      disableClose: true,
      data: {}
    });

    // const dialogRef = this.dialog.open(SimpleInputDialog, {
    //   width: '50%',
    //   disableClose: true,
    //   data: { 
    //     title: "Player Dialog",
    //     message: "Pick username",
    //     placeholder: "Username",
    //     optional: true
    //   }
    // });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.gameService.createPlayer(result.playerName).then(data => {
          this.playerService.setPlayer(data)
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
  private openGame(gameId: Number, player: Player, gamePackage: CardsPackage, cardCount: number): void {
    if (player !== undefined && player.name !== '') {
      this.router.navigateByUrl(`ui/game/${gameId}`, { state: { data: { player: player, cards: gamePackage, cardCount: cardCount } } });
      this.ws._disconnect();
    }
  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'menu-dialog.component.html',
  styleUrls: ['../../app.component.scss']
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

  selectPackage(data){
    this.data.selectedPackage = data;
  }
  

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'player-dialog.component.html',
  styleUrls: ['../../app.component.scss']
})
export class PlayerDialog {

  constructor(
    public dialogRef: MatDialogRef<PlayerDialog>, private gameService: GameService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
