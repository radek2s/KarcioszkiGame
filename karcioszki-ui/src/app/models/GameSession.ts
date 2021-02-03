import { Player } from './Player';
import { CardsPackage } from './CardsPackage';
import { Card } from './Card';
import { GameCardStatistics } from './GameCardStatistics';

export class GameSession{
    id: number;
    started: boolean;
    players: Player[];
    gameState: number;
    gameCardPackage: CardsPackage;
    gameCardStatistics: GameCardStatistics;
    gameCards: Card[];
}
