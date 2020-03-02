package com.regster.tajniacy.repository;

import com.regster.tajniacy.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long> {
}
