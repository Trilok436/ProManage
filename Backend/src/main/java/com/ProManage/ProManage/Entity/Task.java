package com.ProManage.ProManage.Entity;
import com.ProManage.ProManage.Enums.Priority;
import com.ProManage.ProManage.Enums.TaskStatus;
import com.ProManage.ProManage.Enums.TaskType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonIgnoreProperties({"tasks", "members", "workspace"}) // Ignore the heavy/looping fields
    private Project project;

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    @JsonIgnoreProperties({"tasks", "workspaces", "projects"}) // Ignore the user's collections
    private User assignee;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private TaskType type;

    private LocalDate dueDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now(); // Set both on creation
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now(); // Update this every time the task changes
    }
}

