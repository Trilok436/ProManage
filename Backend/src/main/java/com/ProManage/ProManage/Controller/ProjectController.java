package com.ProManage.ProManage.Controller;

import com.ProManage.ProManage.Entity.Project;
import com.ProManage.ProManage.Entity.Workspace;
import com.ProManage.ProManage.Enums.ProjectStatus;
import com.ProManage.ProManage.Repository.ProjectRepository;
import com.ProManage.ProManage.Repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor

public class ProjectController {
    private final ProjectRepository projectRepo;
    private final WorkspaceRepository workspaceRepo;

    @PostMapping
    public Project createProject(@RequestBody Map<String, String> body) {

        Workspace ws = workspaceRepo.findById(
                Long.parseLong(body.get("workspaceId"))
        ).orElseThrow();

        return projectRepo.save(Project.builder()
                .name(body.get("name"))
                .description(body.get("description"))
                .workspace(ws)
                .status(ProjectStatus.PLANNING)
                .build());
    }
    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project details) {
        Project project = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Updating fields to match your React form
        project.setName(details.getName());
        project.setDescription(details.getDescription());
        project.setStatus(details.getStatus());
        project.setPriority(details.getPriority()); // Now works!
        project.setProgress(details.getProgress()); // Now works!
        project.setStartDate(details.getStartDate());
        project.setEndDate(details.getEndDate());

        return projectRepo.save(project);
    }

    @GetMapping("/workspace/{id}")
    public List<Project> getProjects(@PathVariable Long id) {
        return projectRepo.findByWorkspaceId(id);
    }

    @GetMapping("/{id}")
    public Project getProject(@PathVariable Long id) {
        return projectRepo.findById(id).orElseThrow();
    }
}
