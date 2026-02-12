package com.ProManage.ProManage.Controller;

import com.ProManage.ProManage.Enums.ProjectStatus;
import com.ProManage.ProManage.Repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatController {
    private final ProjectRepository projectRepo;

    @GetMapping("/workspace/{id}")
    public Map<String, Object> projectStats(@PathVariable Long id) {

        long total = projectRepo.countByWorkspaceId(id);
        long completed = projectRepo.countByWorkspaceIdAndStatus(id, ProjectStatus.COMPLETED);

        double percent = total == 0 ? 0 : (completed * 100.0) / total;

        return Map.of(
                "totalProjects", total,
                "completedProjects", completed,
                "completionPercent", percent
        );
    }
}
