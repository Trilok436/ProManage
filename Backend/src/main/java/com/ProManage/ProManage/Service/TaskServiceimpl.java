package com.ProManage.ProManage.Service;

import com.ProManage.ProManage.Entity.Project;
import com.ProManage.ProManage.Entity.Task;
import com.ProManage.ProManage.Entity.TaskRequest;
import com.ProManage.ProManage.Entity.User;
import com.ProManage.ProManage.Enums.Priority;
import com.ProManage.ProManage.Enums.TaskStatus;
import com.ProManage.ProManage.Enums.TaskType;
import com.ProManage.ProManage.Repository.ProjectRepository;
import com.ProManage.ProManage.Repository.TaskRepository;
import com.ProManage.ProManage.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TaskServiceimpl implements TaskService{
    private final TaskRepository taskRepo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;
    private final InngestService inngestService;

    @Override
    public Task createTask(TaskRequest req) {

        Project project = projectRepo.findById(req.getProjectId()).orElseThrow();

        User user = null;
        if (req.getAssigneeId() != null) {
            user = userRepo.findById(req.getAssigneeId()).orElse(null);
        }

        Task task = taskRepo.save(
                Task.builder()
                        .title(req.getTitle())
                        .description(req.getDescription())
                        .project(project)
                        .assignee(user)
                        .status(TaskStatus.valueOf(req.getStatus()))
                        .priority(Priority.valueOf(req.getPriority()))
                        .type(TaskType.valueOf(req.getType()))   // ✅ ADD THIS
                        .dueDate(req.getDueDate())
                        .dueDate(req.getDueDate())
                        .build()
        );

        inngestService.sendEvent("task/assigned",
                Map.of(
                        "title", task.getTitle(),
                        "email", user != null ? user.getEmail() : "mahawar20031203@gmail.com"
                )
        );

        return task;
    }


    @Override
    public List<Task> getTasksByProject(Long ProjectId) {
        return taskRepo.findByProjectId(ProjectId);
    }

    @Override
    public Task updateTaskStatus(Long ProjectId, String status) {
        Task task = taskRepo.findById(ProjectId).orElseThrow(() -> new RuntimeException("Task Not Found"));
        task.setStatus(TaskStatus.valueOf(status));
        return taskRepo.save(task);
    }

    @Override
    public List<Task> taskService(Long id) {
        return taskRepo.findByWorkspaceId(id);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepo.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        taskRepo.deleteById(id);
    }
}
