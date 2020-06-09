import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameSession } from 'src/app/models/GameSession';
import { GameService } from 'src/app/services/game.service';
import { PlayerService } from 'src/app/services/player.service';

import { WebSocket } from '../../services/WebSocketAPI';
import { Card } from 'src/app/models/Card';
import { MatDialog } from '@angular/material';
import { GameSummaryDialog } from 'src/app/layout/dialogs/game-summary-dialog.component';
import { SimpleInfoDialog } from 'src/app/layout/dialogs/simple-info-dialog.component';

@Component({
    selector: 'game-session',
    templateUrl: './game.html',
    styleUrls: ['../../karcioszki.style.scss']
})
export class GameNewComponent implements OnInit {

    webSocket: WebSocket
    gameSession: GameSession
    previousTurn: Number = 1
    leaderTurn: Number = 0

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private gameService: GameService,
        private playerService: PlayerService
    ) { }

    ngOnInit(): void {
        const gameId = +this.route.snapshot.paramMap.get('id');
        this.webSocket = new WebSocket(this, `/topic/hub/${gameId}`)
        this.gameService.getGameSession(gameId).subscribe(result => this.gameSession = result)
    }

    ngOnDestroy(): void {
        this.webSocket._disconnect();
    }

    handleWsMessage(message): void {
        // console.debug("Received data:", message)
        this.gameSession = JSON.parse(message);
        if (this.gameSession.gameState != this.previousTurn) {
            this.startTurn()
        }
        if (this.gameSession.gameState == 2 || this.gameSession.gameState == 3 || this.gameSession.gameState == 4) {
            this.dialog.open(GameSummaryDialog, {
                data: {
                    winner: this.gameSession.gameState,
                    activeTeam: this.playerService.getPlayer().team
                }
            })
        }
    }

    selectedCard(card: Card) {
        if (!card.selected) {
            card.selected = true;
            this.updateGame(card.color)
        }
    }

    private updateGame(cardColor) {
        switch (this.validateColor(cardColor, this.playerService.getPlayer().team)) {
            case -1:
                this.endGame("black")
                break;
            case 0:
                this.gameSession.gameCardStatistics.cardToGuess -= 1;
                if (this.gameSession.gameCardStatistics.cardToGuess <= 0) {
                    if (this.playerService.getPlayer().team == 0) {
                        if (this.gameSession.gameCardStatistics.redBonusCards > 0) {
                            this.gameSession.gameCardStatistics.redBonusCards = 0;
                            this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/update`, this.gameSession);
                        } else {
                            this.endTurn();
                        }
                    }
                    if (this.playerService.getPlayer().team == 1) {
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
                this.endGame("blue")
                break
            case 3:
                this.endGame("red")
                break;
        }
    }

    leaderSelect(cardNumber) {
       // this.leaderTurn = 0;
            console.log("lider zrobił ruch");
        this.gameSession.gameCardStatistics.cardToGuess = cardNumber;
        this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/leader`, this.gameSession);

    }

    private validateColor(cardColor, playerTeam) {
        if (cardColor === "blue") {
            this.gameSession.gameCardStatistics.remainingBlueCards -= 1;
            if (this.gameSession.gameCardStatistics.remainingBlueCards == 0) {
                return 2
            }
            if (playerTeam == 0) {
                this.gameSession.gameCardStatistics.redBonusCards = 1;
                return 1
            }
        } else if (cardColor === "red") {
            this.gameSession.gameCardStatistics.remainingRedCards -= 1;
            if (this.gameSession.gameCardStatistics.remainingRedCards == 0) {
                return 3
            }
            if (playerTeam == 1) {
                this.gameSession.gameCardStatistics.blueBounsCards = 1;
                return 1
            }
        } else if (cardColor === "black") {
            return -1
        } else if (cardColor === "orange") {
            return 1
        }
        return 0
    }

    private startTurn() {
        this.previousTurn = this.gameSession.gameState;
       // this.leaderTurn = 1;
        console.log("teraz ruch lidera");

        let message = `Koniec tury! Teraz kolejka przeciwnej drużyny!`
        if (this.gameSession.gameState == this.playerService.getPlayer().team) {
            message = `Teraz Twoja kolej! Przygotuj się!`
        }
        this.dialog.open(SimpleInfoDialog, {
            width: '80%',
            disableClose: true,
            data: {
                title: "Koniec tury",
                message: message
            }
        })
    }

    private endTurn() {
        // console.debug("Next turn - sending gameSesstion: " + this.gameSession.gameState);
        this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/turn`, this.gameSession);
    }

    private endGame(color: string) {
        this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/end`, color);
    }

    private getCardCountSelected(cardCount) {
        if (this.gameSession.gameCardStatistics.cardToGuess == cardCount) {
            return { 'background-color': '#d7d7d7' }
        }
        return null;
    }
}