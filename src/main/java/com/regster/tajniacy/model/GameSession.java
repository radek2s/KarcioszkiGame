package com.regster.tajniacy.model;
import java.util.ArrayList;
import java.util.List;

public class GameSession {

    private int id;
    private boolean started;
    private List<Player> players;
    private int cardCount;
    private int gameState;
    private GameCardPackage gameCardPackage;
    private ArrayList<GameCard> gameCards;

    public GameSession() {
        this.cardCount = 15; //DEFAULT VALUE
    }

    public GameSession(int id) {
        this.id = id;
        this.players = new ArrayList<>();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCardCount() {
        return cardCount;
    }

    public void setCardCount(int cardCount) {
        this.cardCount = cardCount;
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

}
