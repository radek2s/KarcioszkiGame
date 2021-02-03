import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { from, Observable, throwError } from 'rxjs';
import { GameSession } from '../models/GameSession';
import { CardsPackage } from '../models/CardsPackage';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameHubUrl = '/api/game/hub';
  private gameCardPackageUrl = '/api/card';
  private gamePlayerUrl = '/api/game/player/create';
  siteLocale = '';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(private http: HttpClient) { 
    let locale = window.location.pathname.split('/')[1];
    let protocol = window.location.protocol;
    let host = window.location.host.split(":");
  
    if(host[1] === "4200") {
      host[1] = "8080";
    };  
    if(locale !== '') {
      locale = '';
    }

    this.siteLocale = `${protocol}//${host[0]}:${host[1]}${locale}`;
    
    this.gameHubUrl = this.siteLocale + this.gameHubUrl;
    this.gameCardPackageUrl = this.siteLocale + this.gameCardPackageUrl;
    this.gamePlayerUrl = this.siteLocale + this.gamePlayerUrl;
  
  }

  /**
   * Get GameID list
   * Return a currently created game session id's
   */
  getGameIdList() {
    return this.http.get<number[]>(this.gameHubUrl);
  }

  /**
   * Get Game session
   * Return a game session data received from remote server
   * @param id - game session id
   */
  getGameSession(id: number): Observable<GameSession> {
    return this.http.get<GameSession>(`${this.gameHubUrl}/${id}`);
  }

  /**
   * Get CardsPackage from remote server
   */
  getGamePackages(): Observable<CardsPackage[]> {
    return this.http.get<CardsPackage[]>(`${this.gameCardPackageUrl}/getAll`);
  }

  /**
   * Get CardsPackage from remote server
   */
  getGamePackage(id: number): Observable<CardsPackage> {
    return this.http.get<CardsPackage>(`${this.gameCardPackageUrl}/get/${id}`);
  }


  /**
   * Add a new Game Card Package to backend
   * @param cardPackage - package to be added
   */
  addGamePackage(cardPackage: CardsPackage) {
    return this.http.post<CardsPackage>(`${this.gameCardPackageUrl}/create`, cardPackage, this.httpOptions).toPromise();
  }

  updateGamePackage(cardPackage: CardsPackage, packageId: number) {
    return this.http.put<CardsPackage>(`${this.gameCardPackageUrl}/update/${packageId}`, cardPackage, this.httpOptions).toPromise();
  }

  deleteGamePackage(packageId: number) {
    return this.http.delete<CardsPackage>(`${this.gameCardPackageUrl}/delete/${packageId}`, this.httpOptions).toPromise();
  }

  /**
   * Create a new player with unique ID
   * @param playerName - Name of the player
   */
  createPlayer(playerName: string) {
    return this.http.post<any>(this.gamePlayerUrl, playerName, this.httpOptions).toPromise();
  }

  createGameLobby(gameSession, cardCount) {
    return this.http.post<any>(`${this.gameHubUrl}/createLobby/${cardCount}`, gameSession, this.httpOptions);
  }
}

