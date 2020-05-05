package com.regster.tajniacy.model;
import com.regster.tajniacy.repository.GameCardPackageRepository;

import java.util.ArrayList;
import java.util.List;

public class GameSession {

    private int id;
    private boolean started;
    private List<Player> players;
    private int gameState;
    private GameCardPackage gameCardPackage;
    private GameCardStatistics gameCardStatistics;
    private ArrayList<GameCard> gameCards;

    public GameSession() {
        this.gameCardStatistics = new GameCardStatistics(15); //DEFAULT VALUE
    }

    public GameSession(int id) {
        this.id = id;
        this.players = new ArrayList<>();
        this.gameCardStatistics = new GameCardStatistics(15);
    }

    public GameSession(int id, boolean started, List<Player> players, int gameState, GameCardPackage gameCardPackage, ArrayList<GameCard> gameCards, int gameCardCount) {
        this.id = id;
        this.started = started;
        this.players = players;
        this.gameState = gameState;
        this.gameCardPackage = gameCardPackage;
        this.gameCards = gameCards;
        prepareGameCardStatistics(gameCardCount);
    }

    public void prepareGameCardStatistics(int gameCardCount) {
        this.gameCardStatistics = new GameCardStatistics(gameCardCount);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }


    public boolean addPlayer(Player player) {
        if(this.players.contains(player)) {
            return false;
        } else {
            this.players.add(player);
            return true;
        }
    }

    public void updatePlayer(Player player) {
        int position = -1;
        for(Player p: this.players) {
            if(p.getId() == player.getId()) {
                position = this.players.indexOf(p);
            }
        }
        if(position != -1) {
            this.players.set(position, player);
        }
    }

    public void deletePlayer(Player player) {
        int postion = -1;
        for(Player p: this.players) {
            if(p.getId() == player.getId()){
                postion = this.players.indexOf(p);
            }
        }
        if(postion != -1) {
            this.players.remove(postion);
        }
    }

    public GameCardPackage getGameCardPackage() {
        return gameCardPackage;
    }

    public void setGameCardPackage(GameCardPackage gameCardPackage) {
        this.gameCardPackage = gameCardPackage;
    }

    public boolean isStarted() {
        return started;
    }

    public void setStarted(boolean started) {
        this.started = started;
    }

    public int getGameState() {
        return gameState;
    }

    public void setGameState(int gameState) {
        this.gameState = gameState;
    }

    public ArrayList<GameCard> getGameCards() {
        return gameCards;
    }

    public void setGameCards(ArrayList<GameCard> gameCards) {
        this.gameCards = gameCards;
    }

    public GameCardStatistics getGameCardStatistics() {
        return gameCardStatistics;
    }

    public void setGameCardStatistics(GameCardStatistics gameCardStatistics) {
        this.gameCardStatistics = gameCardStatistics;
    }
}
