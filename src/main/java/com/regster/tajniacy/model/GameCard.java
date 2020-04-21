package com.regster.tajniacy.model;

public class GameCard {


    private int id;
    private String text;
    private String color;
    private boolean selected;

    GameCard() {

    }

    public GameCard(String text, int id) {
        this.id = id;
        this.text = text;
        this.selected = false;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }
}
