package com.regster.tajniacy.service;

import com.regster.tajniacy.model.GameCard;

import java.util.ArrayList;
import java.util.List;

public interface GameSessionService {

    public abstract ArrayList<GameCard> prepareGameCards(List<String> gameCards);

    public abstract ArrayList<GameCard> prepareGameCardsColors(ArrayList<GameCard> gameCards, int cardLimit);



}
