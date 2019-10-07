package com.regster.tajniacy.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Player {

    @JsonProperty("name")
    private String name;
    @JsonProperty("team")
    private String team;
    @JsonProperty("leader")
    private boolean leader;

    public Player() {

    }

    public Player(String name) {
        this.name = name;
        this.team = "NONE";
        this.leader = false;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public boolean isLeader() {
        return leader;
    }

    public void setLeader(boolean leader) {
        this.leader = leader;
    }
}
