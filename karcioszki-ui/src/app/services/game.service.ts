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

  private gameHubUrl = './api/game/hub';
  private gameCardPackageUrl = './api/card'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(private http: HttpClient) { }

  /**
   * Get GameID list
   * Return a currently created game session id's
   */
  getGameIdList() {
    return this.http.get<number[]>(this.gameHubUrl)
  }

  /**
   * Get Game session
   * Return a game session data received from remote server
   * @param id - game session id
   */
  getGameSession(id: Number): Observable<GameSession> {
    return this.http.get<GameSession>(`${this.gameHubUrl}/${id}`)
  }

  /**
   * Get CardsPackage from remote server
   */
  getGamePackages(): Observable<CardsPackage[]> {
    return this.http.get<CardsPackage[]>(`${this.gameCardPackageUrl}/getAll`)
  }
  /**
   * Get CardsPackage from remote server
   */
  getGamePackage(id: number): Observable<CardsPackage> {
    // return {"id":2,"author":"Radek","packageName":"Jajecznica","image":null,"cards":["PlayStation","Mikrofon","Kwarantanna","Śnieg","Podłoga","The Sims","Karcioszki","Java","Przemek","Saper","Walizka","Gra","Przygoda","Fotografia"]}
    return this.http.get<CardsPackage>(`${this.gameCardPackageUrl}/get/${id}`)
  }

  /**
   * Add a new Game Card Package to backend
   * @param cardPackage 
   */
  addGamePackage(cardPackage: CardsPackage) {
    console.debug("Adding card package");
    return this.http.post<CardsPackage>(`${this.gameCardPackageUrl}/create`, cardPackage, this.httpOptions).toPromise();
  }

  /**
   * Update the Game Card Package to backend
   * @param cardPackage 
   */
  updateGamePackage(cardPackage: CardsPackage, packageId: number) {
    console.debug("Updating card package");
    return this.http.put<CardsPackage>(`${this.gameCardPackageUrl}/update/${packageId}`, cardPackage, this.httpOptions).toPromise();
  }
  /**
   * Delete the Game Card Package from backend
   * @param cardPackage 
   */
  deleteGamePackage(packageId: number) {
    console.debug("Deleting card package");
    return this.http.delete<CardsPackage>(`${this.gameCardPackageUrl}/delete/${packageId}`, this.httpOptions).toPromise();
  }

  /**
   * Create a new player with unique ID
   * @param playerName - Name of the player
   */
  createPlayer(playerName: string) {
    return this.http.post<any>('./api/game/player/create', playerName, this.httpOptions).toPromise();
  }

}
