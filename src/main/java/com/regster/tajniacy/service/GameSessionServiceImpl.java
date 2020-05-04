package com.regster.tajniacy.service;

import com.regster.tajniacy.model.GameCard;
import com.regster.tajniacy.model.GameSession;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Service
public class GameSessionServiceImpl  implements  GameSessionService{

    @Override
    public ArrayList<GameCard> prepareGameCards(List<String> gameCards) {
        ArrayList<GameCard> preparedGameCards = new ArrayList<>();
        int cardId = 0;
        for (String cardTitle: gameCards) {
            preparedGameCards.add(new GameCard(cardTitle, cardId++));
        }
        Collections.shuffle(preparedGameCards);
        return preparedGameCards;
    }

    @Override
    public ArrayList<GameCard> prepareGameCardsColors(ArrayList<GameCard> gameCards, int cardLimit) {
        boolean isGameCardsEven = cardLimit % 2 == 0;
        int cardBatch = cardLimit / 2;
        int redCards = cardBatch - 1;
        int blueCards = cardBatch - 1;
        int neutralCards = isGameCardsEven ? 1 : 2;
        ArrayList<GameCard> coloredGameCards = new ArrayList<>();

        for(int x = 0; x < cardLimit; x++) {
            GameCard gameCard = gameCards.get(x);
            if (redCards > 0) {
                gameCard.setColor("red");
                coloredGameCards.add(gameCard);
                redCards--;
            } else {
                if (blueCards > 0) {
                    gameCard.setColor("blue");
                    coloredGameCards.add(gameCard);
                    blueCards--;
                } else {
                    if (neutralCards > 0) {
                        gameCard.setColor("orange");
                        coloredGameCards.add(gameCard);
                        neutralCards--;
                    } else {
                        gameCard.setColor("black");
                        coloredGameCards.add(gameCard);
                    }
                }
            }
        }
        Collections.shuffle(coloredGameCards);
        return coloredGameCards;
    }
}
