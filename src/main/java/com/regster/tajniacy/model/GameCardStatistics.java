package com.regster.tajniacy.model;

public class GameCardStatistics {

    private int cardCount;
    private int redCards;
    private int blueCards;
    private int neutralCards;
    private int remainingRedCards;
    private int remainingBlueCards;
    private int blueBounsCards;
    private int redBonusCards;
    private int cardToGuess;

    GameCardStatistics() { }

    GameCardStatistics(int cardCount) {
        this.cardCount = cardCount;
        this.redCards = cardCount / 2 - 1;
        this.blueCards = cardCount / 2 - 1;
        this.neutralCards = cardCount%2 == 0 ? 1 : 2;
        this.remainingRedCards = this.redCards;
        this.remainingBlueCards = this.blueCards;
        this.blueBounsCards = 0;
        this.redBonusCards = 0;
        this.cardToGuess = 0;
    }

    public GameCardStatistics(int cardCount, int redCards, int blueCards, int neutralCards, int remainingRedCards, int remainingBlueCards, int blueBounsCards, int redBonusCards, int cardToGuess) {
        this.cardCount = cardCount;
        this.redCards = redCards;
        this.blueCards = blueCards;
        this.neutralCards = neutralCards;
        this.remainingRedCards = remainingRedCards;
        this.remainingBlueCards = remainingBlueCards;
        this.blueBounsCards = blueBounsCards;
        this.redBonusCards = redBonusCards;
        this.cardToGuess = cardToGuess;
    }

    public int getCardCount() {
        return cardCount;
    }

    public void setCardCount(int cardCount) {
        this.cardCount = cardCount;
    }

    public int getRedCards() {
        return redCards;
    }

    public void setRedCards(int redCards) {
        this.redCards = redCards;
    }

    public int getBlueCards() {
        return blueCards;
    }

    public void setBlueCards(int blueCards) {
        this.blueCards = blueCards;
    }

    public int getNeutralCards() {
        return neutralCards;
    }

    public void setNeutralCards(int neutralCards) {
        this.neutralCards = neutralCards;
    }

    public int getRemainingRedCards() {
        return remainingRedCards;
    }

    public void setRemainingRedCards(int remainingRedCards) {
        this.remainingRedCards = remainingRedCards;
    }

    public int getRemainingBlueCards() {
        return remainingBlueCards;
    }

    public void setRemainingBlueCards(int remainingBlueCards) {
        this.remainingBlueCards = remainingBlueCards;
    }

    public int getBlueBounsCards() {
        return blueBounsCards;
    }

    public void setBlueBounsCards(int blueBounsCards) {
        this.blueBounsCards = blueBounsCards;
    }

    public int getRedBonusCards() {
        return redBonusCards;
    }

    public void setRedBonusCards(int redBonusCards) {
        this.redBonusCards = redBonusCards;
    }

    public int getCardToGuess() {
        return cardToGuess;
    }

    public void setCardToGuess(int cardToGuess) {
        this.cardToGuess = cardToGuess;
    }
}
