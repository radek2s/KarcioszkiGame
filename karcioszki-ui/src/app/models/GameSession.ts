import { Player } from './Player';
import { CardsPackage } from './CardsPackage';
import { Card } from './Card';

export class GameSession{
    id:number;
    started:boolean;
    players: Player[];
    gameState:Number;
    gameCardPackage: CardsPackage;
    gameCards: Card[];
}