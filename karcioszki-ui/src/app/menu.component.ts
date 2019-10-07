import { Component, OnInit, Inject } from '@angular/core';
import { GameService } from './game.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CardsPackage } from 'src/models/CardsPackage';
import { WebSocket } from './WebSocketAPI';

@Component({
  selector: 'app-root',
  templateUrl: './menu.component.html',
  styleUrls: ['./app.component.scss']
})
export class MenuComponent implements OnInit {
  
  playerName: string;
  gameIds:Number[] = [];
  selectedGame: Number;
  cardsPackage: CardsPackage;
  ws: WebSocket;

  constructor(private gameService: GameService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void{
    this.getGameIds();
    this.ws = new WebSocket(this, "/topic/hub");
  }

  onSelect(id){
      this.selectedGame = id;
  }

  getGameIds(): void {
      this.gameService.getGameIdList().subscribe((data) => {
        this.gameIds = data;
      });
  }

  navigateTo(){
      this.openGame(this.selectedGame, this.playerName, null);
  }

  openDialog(){
    const dialogRef = this.dialog.open(MenuDialog, {
        width: '80%',
        data: {selectedPackage: null, playerName: this.playerName, gameId: 1}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result !== undefined) this.openGame(result.gameId, result.playerName, result.selectedPackage);
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
   * @param playerName [string] Name of the user
   * @param gamePackage [CardsPackage] Selected cards package
   */
  private openGame(gameId: Number, playerName: string, gamePackage: CardsPackage): void {
    if(playerName !== undefined && playerName !== '') {
      this.router.navigateByUrl(`/game/${gameId}`, {state: {data: {player: playerName, cards: gamePackage}}});
      this.ws._disconnect();
    }
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
