package com.ProManage.ProManage.Repository;

import com.ProManage.ProManage.Entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long id);
    @Query("SELECT t FROM Task t WHERE t.project.workspace.id = :workspaceId")
    List<Task> findByWorkspaceId(Long workspaceId);

}
