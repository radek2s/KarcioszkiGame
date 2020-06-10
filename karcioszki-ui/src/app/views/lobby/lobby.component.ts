import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { GameService } from 'src/app/services/game.service';

import { WebSocket } from '../../services/WebSocketAPI';
import { ActivatedRoute, Router } from '@angular/router';
import { GameSession } from 'src/app/models/GameSession';
import { Player } from 'src/app/models/Player';

@Component({
    selector: 'game-lobby',
    templateUrl: './lobby.html',
    //StyleURLS to fix
    styleUrls: ['../../karcioszki.style.scss']
})
export class LobbyComponent implements OnInit {

    webSocket: WebSocket
    gameSession: GameSession
    gameValid: boolean = false

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private gameService: GameService,
        private playerService: PlayerService
    ) { }

    ngOnInit(): void {
        const gameId = +this.route.snapshot.paramMap.get('id');
        this.webSocket = new WebSocket(this, `/topic/hub/${gameId}`)
        this.gameService.getGameSession(gameId).subscribe(result => {
            this.gameSession = result;
            setTimeout(() => { this.webSocketPlayerAdd(this.playerService.getPlayer()) }, 2000)
        })
    }

    ngOnDestroy(): void {
        this.webSocket._disconnect();
    }

    changeTeam(player: Player): void {
        if (player.id === this.playerService.getPlayer().id) {
            player.team = player.team == 0 ? 1 : 0;
            this.webSocketPlayerUpdate(player)
        }
    }

    changeLeader(player: Player): void {
        if (player.id === this.playerService.getPlayer().id) {
            if (player.leader === undefined) {
                player.leader = false;
            }
            player.leader = !player.leader;
            this.webSocketPlayerUpdate(player)
        }
    }

    handleWsMessage(message): void {
        // console.debug("Received data:", message)
        this.gameSession = JSON.parse(message);
        this.gameValid = this.validateGameStatus()
        this.excludeDuplicatedPlayer(this.playerService.getPlayer());
        if (this.gameSession.started) {
            this.router.navigateByUrl(`/game/${this.gameSession.id}`)
        }
    }

    lobbyStartGame() {
        this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/start`, null);
        this.router.navigateByUrl(`/game/${this.gameSession.id}`)
    }

    lobbyExitGame() {
        this.webSocketPlayerRemove(this.playerService.getPlayer())
        this.router.navigateByUrl('/')
    }

    webSocketPlayerAdd(player: Player) {
        if (!this.gameSession.players.find(e => e.id === player.id)) {
            // console.debug("Sending a player data to WebSocket")
            this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/player/add`, player)
        }
    }
    webSocketPlayerUpdate(player: Player) {
        this.playerService.setPlayer(player);
        this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/player/update`, player)
    }
    webSocketPlayerRemove(player: Player) {
        this.webSocket.sendMessage(`/app/game/hub/${this.gameSession.id}/player/exit`, player);
    }

    private excludeDuplicatedPlayer(player: Player) {
        this.gameSession.players = this.gameSession.players.filter(e => e.id !== player.id);
    }

    /**
    * Check if is enough players to start the game
    * Validate all contitions
    */
    private validateGameStatus() {
        const minPlayerCount = 4;

        let playerCount = this.gameSession.players.length;
        let redLeaderCount = 0;  //TeamID 0
        let redNonLeaderCount = 0;
        let blueLeaderCount = 0; //TeamID 1
        let blueNonLeaderCount = 0;

        this.gameSession.players.forEach(player => {
            if (player.leader == true) {
                if (player.team == 0) {
                    redLeaderCount = redLeaderCount + 1;
                } else {
                    blueLeaderCount = blueLeaderCount + 1;
                }
            } else {
                if (player.team == 0) {
                    redNonLeaderCount = redNonLeaderCount + 1;
                } else {
                    blueNonLeaderCount = blueNonLeaderCount + 1;
                }
            }
        });

        if (playerCount >= minPlayerCount) {
            if (
                redLeaderCount === 1 && 
                blueLeaderCount === 1 && 
                redNonLeaderCount >= 1 && blueNonLeaderCount >=1) {
                return false;
            }
        }
        return true;
    }

}