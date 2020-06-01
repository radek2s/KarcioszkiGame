import { OnInit, Component } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { WebSocket } from '../../services/WebSocketAPI';
import { GameService } from 'src/app/services/game.service';
import { PlayerService } from 'src/app/services/player.service';
import { CreateGameLobbyDialog } from 'src/app/layout/dialogs/game-create-lobby-dialog.component';

import { GameSession } from 'src/app/models/GameSession';
import { SimpleInputDialog } from 'src/app/layout/dialogs/simple-input-dialog.component';
import { ColorSchemeService } from 'src/app/services/color-scheme.service';

@Component({
    selector: 'game-main-menu',
    templateUrl: './home.html',
    styleUrls: ['../../karcioszki.style.scss']
})
export class HomeComponent implements OnInit {

    gameIdList: number[];
    webSocket: WebSocket;
    theme: string;

    constructor(
        private gameService: GameService,
        private playerService: PlayerService,
        private colorSchemeService: ColorSchemeService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.theme = this.colorSchemeService.currentActive();
        this.webSocket = new WebSocket(this, "/topic/hub")
        this.gameService.getGameIdList().subscribe(data => this.gameIdList = data)
        this.initializePlayer()
    }

    ngOnDestroy(): void {
        this.webSocket._disconnect();
    }

    /**
     * Create Game Lobby to set up players.
     * Open dialog to select card package and generate game ID
     * TODO:// Expand game lobby to be secured via password
     */
    public createGameLobby(): void {
        const maxId = Math.floor(Math.random()*100000);
        const dialogReference = this.dialog.open(CreateGameLobbyDialog, {
            width: '90%',
            data: { selectedPackage: null, gameId: maxId + 1, cardCount: 15}
        });
        dialogReference.afterClosed().subscribe(result => {
            if(result !== undefined) {
                let gameSession = new GameSession();
                gameSession.id = result.gameId;
                gameSession.players = [];
                gameSession.started = false;
                gameSession.gameCardPackage = result.selectedPackage;
                if(result.cardCount > result.selectedPackage.cards.length) {
                    result.cardCount = result.selectedPackage.cards.length
                }
                if(result.cardCount < 8) {
                    result.cardCount = 8
                    if(result.cardCount > result.selectedPackage.cards.length) {
                        this.snackBar.open("Błąd przy zakładaniu gry za mało kart w paczce", "Zamknij", {duration: 3000})
                    }
                }
                this.gameService.createGameLobby(gameSession, result.cardCount).subscribe(response => {
                    if(response.status == "Created") {
                        this.joinGameLobby(result.gameId)
                    } else {
                        this.snackBar.open("Błąd przy zakładaniu gry.", "Zamknij", {duration: 3000})
                    }
                })
            }
        })
    }

    /**
     * Navigate user to specific Game Lobby
     * @param gameId - exising open Game Lobby
     */
    public joinGameLobby(gameId): void {
        this.router.navigateByUrl(`/lobby/${gameId}`)
    }
    
    /**
     * Invoke this method to load player data from broweser 
     * or to show player creation dialog
     */
    private initializePlayer(): void {
        if (this.playerService.getPlayer() === undefined || this.playerService.getPlayer() === null) {
            const dialogReference = this.dialog.open(SimpleInputDialog, {
                width: '50%',
                disableClose: true,
                data: {
                    title: "Tworzenie użytkownika",
                    message: `Witaj w aplikacji Karcioszki! Aby móc zagrać podaj nazwę użytkownika:`,
                    placeholder: "Nazwa użytkownika"
                }
            });
            dialogReference.afterClosed().subscribe(res => {
                if (res !== undefined) {
                    this.gameService.createPlayer(res)
                        .then(data => this.playerService.setPlayer(data))
                }
            })
        }
    }

    private setTheme() {
        if (this.theme == "dark") {
            this.theme = "light";
        } else {
            this.theme = "dark";
        }
        this.colorSchemeService.update(this.theme);
    }

    handleWsMessage(message): void {
        this.gameIdList = JSON.parse(message)
    }

}