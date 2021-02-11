import { Injectable } from '@angular/core';
import { Player } from '../models/Player';
import { Router } from '@angular/router';

/**
 * Player service to handle ActivePlayer status
 * Including basic methods and initialization.
 */
@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    private activePlayer: Player;

    constructor(private router: Router) {
        if (this.activePlayer === undefined || this.activePlayer === null) {
            this.loadActivePlayerFromBrowser();
        }
    }

    public getPlayer(): Player {
        return this.activePlayer;
    }

    public setPlayer(player: Player): void {
        this.activePlayer = player;
        this.saveActivePlayerToBrowser();
    }

    /**
     * Save Active Player Data to Session Storage
     *
     * Saving active player data to session storage allow to navigate
     * through the application without passing the player data all the time.
     */
    public saveActivePlayerToBrowser(): void {
        sessionStorage.setItem('activePlayer', JSON.stringify(this.activePlayer));
    }

    /**
     * Load Active Player data from Session Storage
     *
     * If player data exist, load them from the browser memory.
     * If there is no data redirect to main page to create a new user.
     */
    public loadActivePlayerFromBrowser(): void {
        this.activePlayer = JSON.parse(sessionStorage.getItem('activePlayer'));
        if (this.activePlayer === null || this.activePlayer === undefined) {
            this.router.navigateByUrl('/');
        }
    }
}
