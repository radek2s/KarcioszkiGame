import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameSession } from 'src/app/models/GameSession';
import { GameService } from 'src/app/services/game.service';
import { PlayerService } from 'src/app/services/player.service';

import { WebSocket } from '../../services/WebSocketAPI';
import { Card } from 'src/app/models/Card';
import { MatDialog } from '@angular/material/dialog';
import { GameSummaryDialog } from 'src/app/layout/dialogs/game-summary-dialog.component';

@Component({
    selector: 'game-session',
    templateUrl: './game.html',
    styleUrls: ['../../karcioszki.style.scss'],
})
export class GameNewComponent implements OnInit, OnDestroy {

    webSocket: WebSocket;
    gameSession: GameSession;
    previousTurn = 0;
    activeCards = false;
    displayDialog = false;
    messageForPlayers = '';

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private gameService: GameService,
        public playerService: PlayerService
    ) { }

    ngOnInit(): void {
        const gameId = +this.route.snapshot.paramMap.get('id');
        this.webSocket = new WebSocket(this, `/topic/hub/${gameId}`);
        this.gameService.getGameSession(gameId).subscribe(result => this.gameSession = result);
        this.animateDialog();
    }

    ngOnDestroy(): void {
        this.webSocket._disconnect();
    }

    handleWsMessage(message): void {
        // console.debug("Received data:", message)
        this.gameSession = JSON.parse(message);
        this.activeCards = true;
        if (this.gameSession.gameCardStatistics.cardToGuess > 0) {
            this.activeCards = this.gameSession.gameState !== this.playerService.getPlayer().team;
        }
        if (this.gameSession.gameState !== this.previousTurn) {
            this.startTurn();
        }
        if (this.gameSession.gameState === 2 || this.gameSession.gameState === 3 || this.gameSession.gameState === 4) {
            this.dialog.open(GameSummaryDialog, {
                disableClose: true,
                data: {
                    winner: this.gameSession.gameState,
                    activeTeam: this.playerService.getPlayer().team
                }
            });
        }
    }

    selectedCard(card: Card) {
        if (!card.selected) {
            card.selected = true;
            this.updateGame(card.color);
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
                            this.gameSession.gameCardStatistics.cardToGuess++;
                            this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/update`, this.gameSession);
                        } else {
                            this.endTurn();
                        }
                    }
                    if (this.playerService.getPlayer().team === 1) {
                        if (this.gameSession.gameCardStatistics.blueBounsCards > 0) {
                            this.gameSession.gameCardStatistics.blueBounsCards = 0;
                            this.gameSession.gameCardStatistics.cardToGuess++;
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
        this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/leader`, this.gameSession);
    }

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

    public startTurn() {
        this.previousTurn = this.gameSession.gameState;
        if (this.previousTurn === 0 || this.previousTurn === 1) {
            this.animateDialog();
            this.messageForPlayers = $localize`:@@gameTurnEnd:End of Turn! Now the opposite team make moves.`;
            if (this.gameSession.gameState === this.playerService.getPlayer().team) {
                this.messageForPlayers = $localize`:@@gameTurnStart:Now your Turn! Get Ready!`;
            }
        }
    }

    public endTurn() {
        // console.debug("Next turn - sending gameSesstion: " + this.gameSession.gameState);
        this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/turn`, this.gameSession);
    }

    public endGame(color: string) {
        this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/end`, color);
    }

    public getCardCountSelected(cardCount) {
        if (this.gameSession.gameCardStatistics.cardToGuess === cardCount) {
            return { 'background-color': '#d7d7d7' };
        }
        return null;
    }

    /**
     * animate dialog
     * When starting a new turn - invoke @displayTurnMessage animation
     * When object is initialized it moves from top to the center then
     * when it is destroyed it changes it's opacity to 0 after 4000ms
     */
    private animateDialog() {
        this.displayDialog = true;
        setTimeout(() => {
            this.displayDialog = false;
        }, 4000);
    }
}
