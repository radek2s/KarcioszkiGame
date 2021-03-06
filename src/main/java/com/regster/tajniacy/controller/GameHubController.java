package com.regster.tajniacy.controller;

import com.regster.tajniacy.model.ActiveTeam;
import com.regster.tajniacy.model.GameCardPackage;
import com.regster.tajniacy.model.GameSession;
import com.regster.tajniacy.model.Player;
import com.regster.tajniacy.repository.PlayerRepository;
import com.regster.tajniacy.service.GameSessionService;
import com.regster.tajniacy.service.GameSessionServiceImpl;
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
 *
 * @author Radek Jajko
 * <p>
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
    @Autowired
    private GameSessionService gameSessionService;

    /**
     * Show Games
     * <p>
     * While opening the main view, handle this request to return
     * currently created gameSessionIds.
     *
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
     * <p>
     * Join or create a new gameSession if it do not exist. Then send a message
     * about created game to WebSocket topic. And for API request return this gameSession
     *
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
            if (getGameSessionById(id) == null) {
                this.gameSessions.add(currentGameSession);
                this.template.convertAndSend("/topic/hub", getGameSessionIds());
            }
        }
        return new ResponseEntity<GameSession>(getGameSessionById(id), HttpStatus.OK);
    }

    @PostMapping(value = "/hub/createLobby/{cardCount}")
    public ResponseEntity<String> createGameLobby(@RequestBody GameSession newGameSession, @PathVariable("cardCount") int cardCount) {

        newGameSession.prepareGameCardStatistics(cardCount);
        if(this.gameSessions == null) {
            this.gameSessions = new ArrayList<>();
        }
        if(getGameSessionById(newGameSession.getId()) == null) {
            this.gameSessions.add(newGameSession);
            this.template.convertAndSend("/topic/hub", getGameSessionIds());
            //201 Created
            return  new ResponseEntity<String>("{\"status\":\"Created\"}", HttpStatus.CREATED);
        } else {
            //409 Conflict
            return  new ResponseEntity<String>("{\"status\":\"Failed\"}", HttpStatus.CONFLICT);
        }
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
        if (gameSession.getPlayers().isEmpty()) {
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
        gameSession.getGameCardStatistics().setCardCount(cardCount);
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/start")
    @SendTo("/topic/hub/{id}")
    public GameSession selectGameCardPackage(@DestinationVariable int id) {
        GameSession gameSession = getGameSessionById(id);
        gameSession.setStarted(true);
        gameSession.setGameState(ActiveTeam.TEAM_A.ordinal());
        gameSession.setGameCards(
                gameSessionService.prepareGameCardsColors(
                        gameSessionService.prepareGameCards(gameSession.getGameCardPackage().getCards()), gameSession.getGameCardStatistics().getCardCount()));
        this.template.convertAndSend("/topic/hub", getGameSessionIds());
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/update")
    @SendTo("/topic/hub/{id}")
    public GameSession gameUpdated(@DestinationVariable int id, GameSession gameSession) {
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/leader")
    @SendTo("/topic/hub/{id}")
    public GameSession gameLeaderStart(@DestinationVariable int id, GameSession gameSession) {
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/turn")
    @SendTo("/topic/hub/{id}")
    public GameSession gameNextTurn(@DestinationVariable int id, GameSession gameSession) {

        if (gameSession.getGameState() == ActiveTeam.TEAM_A.ordinal()) {
            gameSession.setGameState(ActiveTeam.TEAM_B.ordinal());
        } else {
            gameSession.setGameState(ActiveTeam.TEAM_A.ordinal());
        }
        gameSession.getGameCardStatistics().setCardToGuess(0);
        return gameSession;
    }

    @MessageMapping("/game/hub/{id}/end")
    @SendTo("/topic/hub/{id}")
    public GameSession gameFinished(@DestinationVariable int id, String lastCardColor) {
        GameSession gameSession = getGameSessionById(id);
        if (lastCardColor.equals("\"blue\"")) {
            gameSession.setGameState(ActiveTeam.FINISHED_BLUE.ordinal());
        } else if (lastCardColor.equals("\"red\"")) {
            gameSession.setGameState(ActiveTeam.FINISHED_RED.ordinal());
        } else if (lastCardColor.equals("\"give_up\"")) {
            gameSession.setGameState(ActiveTeam.FINISHED_GIVE_UP.ordinal());
        } else {
            gameSession.setGameState(ActiveTeam.FINISHED_BLACK.ordinal());
        }
        try {
            System.out.println(gameSessions.size());
            this.gameSessions.remove(gameSession);
            System.out.println(gameSessions.size());
        } catch (Exception e) {
            System.err.println("Game Session do not exists");
        }

        return gameSession;
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
        if (this.gameSessions != null) {
            for (GameSession gameSession : this.gameSessions) {
                if (!gameSession.isStarted()) {
                    gameIds.add(gameSession.getId());
                }
            }
        }
        return gameIds;
    }

}
