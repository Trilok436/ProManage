package com.ProManage.ProManage.Repository;

import com.ProManage.ProManage.Entity.Project;
import com.ProManage.ProManage.Enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByWorkspaceId(Long id);

    long countByWorkspaceId(Long id);
    long countByWorkspaceIdAndStatus(Long id, ProjectStatus status);

}
