package com.regster.tajniacy.controller;

import com.regster.tajniacy.model.ActiveTeam;
import com.regster.tajniacy.model.GameCardPackage;
import com.regster.tajniacy.model.GameSession;
import com.regster.tajniacy.model.Player;
import com.regster.tajniacy.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;

/**
 * Game Hub Controller Class
 * @author Radek Jajko
 *
 * Main class to handle the game events. Handle user requests for API and
 * WebSocket messages.  This class holds every created gameSession, it also provide
 * a methotds to create a new sessions and to setup the game.
 */
@Controller
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/api/game")
public class GameHubController {

    private ArrayList<GameSession> gameSessions;
    private SimpMessagingTemplate template;

    @Autowired
    public GameHubController(SimpMessagingTemplate template) {
        this.template = template;
    }
    @Autowired
    private PlayerRepository playerRepository;

    /**
     * Show Games
     *
     * While opening the main view, handle this request to return
     * currently created gameSessionIds.
     * @return gameSessionIds
     */
    @RequestMapping(value = "/hub")
    @MessageMapping("/game/hub")
    @SendTo("/topic/hub")
    public ResponseEntity<ArrayList<Integer>> showGames() {
        return new ResponseEntity<>(getGameSessionIds(), HttpStatus.OK);
    }

    /**
     * OpenGame
     *
     * Join or create a new gameSession if it do not exist. Then send a message
     * about created game to WebSocket topic. And for API request return this gameSession
     * @param id id of the game
     * @return GameSession
     */
    @RequestMapping(value = "/hub/{id}")
    public ResponseEntity<GameSession> openGame(@PathVariable("id") int id) {
        GameSession currentGameSession = new GameSession(id);
        if (this.gameSessions == null) {
            this.gameSessions = new ArrayList<>();
            this.gameSessions.add(currentGameSession);
            this.template.convertAndSend("/topic/hub", getGameSessionIds());
        } else {
            if(getGameSessionById(id) == null) {
                this.gameSessions.add(currentGameSession);
                this.template.convertAndSend("/topic/hub", getGameSessionIds());
            }
        }
        return new ResponseEntity<>(getGameSessionById(id), HttpStatus.OK);
    }

    /**
     * Create a new player entity in database with unique ID
     *
     * @param playerName - name of the new player
     * @return HTTP Response with created PlayerJSON data
     */
    @PostMapping("/player/create")
    public ResponseEntity<Player> createPlayer(@Valid @RequestBody String playerName) {
        return ResponseEntity.ok().body(playerRepository.save(new Player(playerName)));
    }

    @MessageMapping("/game/hub/{id}/player/add")
    @SendTo("/topic/hub/{id}")
    public GameSession addPlayer(@DestinationVariable int id, Player player) {
        GameSession gameSession = getGameSessionById(id);
        gameSession.addPlayer(player);
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/player/update")
    @SendTo("/topic/hub/{id}")
    public GameSession updatePlayer(@DestinationVariable int id, Player player) {
        GameSession gameSession = getGameSessionById(id);
        gameSession.updatePlayer(player);
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/player/exit")
    @SendTo("/topic/hub/{id}")
    public GameSession exitPlayer(@DestinationVariable int id, Player player) {
        GameSession gameSession = getGameSessionById(id);
        gameSession.deletePlayer(player);
        if(gameSession.getPlayers().isEmpty()) {
            gameSessions.remove(gameSession);
            this.template.convertAndSend("/topic/hub", getGameSessionIds());
        }
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/card-package")
    @SendTo("/topic/hub/{id}")
    public GameSession selectGameCardPackage(@DestinationVariable int id, GameCardPackage selectedGameCardPackage) {
        GameSession gameSession = getGameSessionById(id);
        gameSession.setGameCardPackage(selectedGameCardPackage);
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/card-count")
    @SendTo("/topic/hub/{id}")
    public GameSession setCardCount(@DestinationVariable int id, int cardCount) {
        GameSession gameSession = getGameSessionById(id);
        gameSession.setCardCount(cardCount);
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/start")
    @SendTo("/topic/hub/{id}")
    public GameSession selectGameCardPackage(@DestinationVariable int id) {
        GameSession gameSession = getGameSessionById(id);
        gameSession.setStarted(true);
        gameSession.setGameState(ActiveTeam.TEAM_A.ordinal());
        gameSession.setGameCards(gameSession.getGameCardPackage().prepareCards(gameSession.getCardCount()));
        this.template.convertAndSend("/topic/hub", getGameSessionIds());
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/update")
    @SendTo("/topic/hub/{id}")
    public GameSession gameUpdated(@DestinationVariable int id, GameSession gameSession) {
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/turn")
    @SendTo("/topic/hub/{id}")
    public GameSession gameNextTurn(@DestinationVariable int id, GameSession gameSession) {

        if(gameSession.getGameState() == ActiveTeam.TEAM_A.ordinal()) {
            gameSession.setGameState(ActiveTeam.TEAM_B.ordinal());
        } else {
            gameSession.setGameState(ActiveTeam.TEAM_A.ordinal());
        }
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/end")
    @SendTo("/topic/hub/{id}")
    public GameSession gameFinished(@DestinationVariable int id, GameSession gameSession) {
        GameSession gameSession2 = getGameSessionById(id);
        gameSession2.setGameState(ActiveTeam.FINISHED.ordinal());
        return gameSession2;
    }

    private GameSession getGameSessionById(int id) {
        if (this.gameSessions != null) {
            for (GameSession gs : this.gameSessions) {
                if (gs.getId() == id) {
                    return gs;
                }
            }
        }
        return null;
    }

    private ArrayList<Integer> getGameSessionIds() {
        ArrayList<Integer> gameIds = new ArrayList<>();
        if(this.gameSessions != null) {
            for (GameSession gameSession: this.gameSessions) {
                if(!gameSession.isStarted()) {
                    gameIds.add(gameSession.getId());
                }
            }
        }
        return gameIds;
    }

}
