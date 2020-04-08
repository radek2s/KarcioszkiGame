package com.regster.tajniacy.controller;

import com.regster.tajniacy.model.GameCardPackage;
import com.regster.tajniacy.repository.GameCardPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/api/card")
public class GameCardPackageController {

    @Autowired
    private GameCardPackageRepository gameCardPackageRepository;

    @GetMapping("/getAll")
    public List<GameCardPackage> getAllGameCards() {
        return gameCardPackageRepository.findAll();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<GameCardPackage> getGameCardById(@PathVariable(value = "id") Long gameCardId)  {
        GameCardPackage gameCard = gameCardPackageRepository.findById(gameCardId).orElseThrow(null);
        return ResponseEntity.ok().body(gameCard);
    }

    @PostMapping("/create")
    public GameCardPackage createGameCard(@Valid @RequestBody GameCardPackage gameCardPackage) {
        System.out.println("Received Data");
        return gameCardPackageRepository.save(gameCardPackage);
    }

    @PutMapping("update/{id}")
    public GameCardPackage updateGameCard(@Valid @RequestBody GameCardPackage gameCardPackage) {
        System.out.println("Updated gamecardPackage");
        return gameCardPackageRepository.save(gameCardPackage);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteGameCardById(@PathVariable(value = "id") Long gameCardId) {
        GameCardPackage gameCard = gameCardPackageRepository.findById(gameCardId).orElseThrow(null);
        gameCardPackageRepository.delete(gameCard);
        System.out.println("Game Card Package --- Deleted");
//        return ResponseEntity.ok().body("{'status':'deleted'}");
    }

}