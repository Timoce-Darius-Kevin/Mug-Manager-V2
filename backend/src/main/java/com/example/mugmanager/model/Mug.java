package com.example.mugmanager.model;

import jakarta.persistence.*;

@Entity
public class Mug {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    // Auth0 subject of the owner (e.g., "auth0|123...")
    private String ownerSub;

    public Mug() {}

    public Mug(String name, String description, String ownerSub) {
        this.name = name;
        this.description = description;
        this.ownerSub = ownerSub;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getOwnerSub() { return ownerSub; }
    public void setOwnerSub(String ownerSub) { this.ownerSub = ownerSub; }
}
