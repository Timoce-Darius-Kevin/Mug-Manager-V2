package com.example.mugmanager.repo;

import com.example.mugmanager.model.Mug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MugRepository extends JpaRepository<Mug, Long> {
    List<Mug> findByOwnerSub(String ownerSub);

    @Query("select distinct m.ownerSub from Mug m where m.ownerSub is not null")
    List<String> findDistinctOwnerSubs();
}
