package com.regster.tajniacy.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
public class GameCardPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String author;
    private String packageName;
    @Column(columnDefinition = "TEXT")
    private String image;

    @ElementCollection
    @CollectionTable(name = "listOfCards")
    private List<String> cards = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<String> getCards() {
        return cards;
    }

    public void setCards(List<String> cards) {
        this.cards = cards;
    }

    public ArrayList<GameCard> prepareCards(int cardCount) {
        ArrayList<GameCard> cards = new ArrayList<>();
        int cardId = 0;
        for (String cardText : this.cards) {
            cards.add(new GameCard(cardText, cardId++));
        }
        Collections.shuffle(cards);
        if(cards.size() < cardCount) {
            cardCount = cards.size();
        }
        cards = setCardColors(cards, cardCount);
        Collections.shuffle(cards);
        return cards;
    }

    private ArrayList<GameCard> setCardColors(ArrayList<GameCard> gameCards, int cardCount) {

        int cardColored = cardCount / 2;
        boolean isEven = cardCount % 2 == 0;
        int red = cardColored - 1;
        int blue = cardColored - 1;
        int neutral = isEven ? 1 : 2;
        ArrayList<GameCard> cards = new ArrayList<>();

        for(int x = 0; x < cardCount; x++) {
            GameCard gameCard = gameCards.get(x);
            if (red > 0) {
                gameCard.setColor("red");
                cards.add(gameCard);
                red--;
            } else {
                if (blue > 0) {
                    gameCard.setColor("blue");
                    cards.add(gameCard);
                    blue--;
                } else {
                    if (neutral > 0) {
                        gameCard.setColor("orange");
                        cards.add(gameCard);
                        neutral--;
                    } else {
                        gameCard.setColor("black");
                        cards.add(gameCard);
                    }
                }
            }
        }

        return cards;
    }
}
