import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GAME_IDS } from '../mocks/games'
import { from, Observable } from 'rxjs';
import { GameSession } from 'src/models/GameSession';
import { CardsPackage } from 'src/models/CardsPackage';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameHubUrl = './api/game/hub';
  private gameCardPackageUrl = './api/card'

  constructor(private http: HttpClient) { }

  /**
   * Get GameID list
   * Return a currently created game session id's
   */
  getGameIdList(){
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

}
