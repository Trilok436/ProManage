package com.ProManage.ProManage.Service;

import com.ProManage.ProManage.Entity.Task;
import com.ProManage.ProManage.Entity.TaskRequest;

import java.util.List;

public interface TaskService {
    Task createTask(TaskRequest req);

    List<Task> getTasksByProject(Long id);

    Task updateTaskStatus(Long id, String status);

    List<Task> taskService(Long id);

    void deleteTask(Long id);
}
