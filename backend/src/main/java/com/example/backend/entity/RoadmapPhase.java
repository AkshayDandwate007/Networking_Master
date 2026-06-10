package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roadmap_phases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapPhase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String timeRange;

    @Column(nullable = false)
    private String salary;

    @Column(nullable = false, length = 1000)
    private String topics;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private String status;
}
