package com.regster.tajniacy.model;
import java.util.ArrayList;
import java.util.List;

public class GameSession {

    private int id;
    private boolean started;
    private List<Player> players;
    private int gameState;
    private GameCardPackage gameCardPackage;
    private ArrayList<GameCard> gameCards;

    public GameSession() {

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
            if(p.getName().equalsIgnoreCase(player.getName())) {
                position = this.players.indexOf(p);
            }
        }
        if(position != -1) {
            this.players.set(position, player);
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
