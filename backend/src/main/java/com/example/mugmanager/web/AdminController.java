package com.example.mugmanager.web;

import com.example.mugmanager.model.Mug;
import com.example.mugmanager.repo.MugRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final MugRepository mugRepository;

    public AdminController(MugRepository mugRepository) {
        this.mugRepository = mugRepository;
    }

    // List distinct users (by ownerSub) and count of their mugs
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminUserDTO> listUsers() {
        List<String> subs = mugRepository.findDistinctOwnerSubs();
        var counts = mugRepository.findAll().stream()
                .filter(m -> m.getOwnerSub() != null)
                .collect(Collectors.groupingBy(Mug::getOwnerSub, Collectors.counting()));
        return subs.stream()
                .map(sub -> new AdminUserDTO(sub, counts.getOrDefault(sub, 0L)))
                .collect(Collectors.toList());
    }

    // List mugs for a specific user
    @GetMapping("/users/{sub}/mugs")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Mug> listUserMugs(@PathVariable String sub) {
        return mugRepository.findByOwnerSub(sub);
    }
}