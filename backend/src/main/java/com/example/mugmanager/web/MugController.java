package com.example.mugmanager.web;

import com.example.mugmanager.model.Mug;
import com.example.mugmanager.repo.MugRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mugs")
public class MugController {
    private final MugRepository mugRepository;

    public MugController(MugRepository mugRepository) {
        this.mugRepository = mugRepository;
    }

    // Admin: list all mugs
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Mug> getAll() {
        return mugRepository.findAll();
    }

    // User: list own mugs
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public List<Mug> getMine(Authentication auth) {
        String sub = auth.getName();
        return mugRepository.findByOwnerSub(sub);
    }

    // User: add mug (owner is current user)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public Mug create(@RequestBody Mug mug, Authentication auth) {
        mug.setId(null);
        mug.setOwnerSub(auth.getName());
        return mugRepository.save(mug);
    }

    // User: update own mug or admin can update any
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Mug update(@PathVariable Long id, @RequestBody Mug updated, Authentication auth) {
        Mug existing = mugRepository.findById(id).orElseThrow();
        boolean isOwner = existing.getOwnerSub() != null && existing.getOwnerSub().equals(auth.getName());
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isOwner && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException("Not allowed");
        }
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        return mugRepository.save(existing);
    }

    // User: delete own mug or admin can delete any
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void delete(@PathVariable Long id, Authentication auth) {
        Mug m = mugRepository.findById(id).orElseThrow();
        boolean isOwner = m.getOwnerSub() != null && m.getOwnerSub().equals(auth.getName());
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin"));
        if (!isOwner && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException("Not allowed");
        }
        mugRepository.deleteById(id);
    }
}
