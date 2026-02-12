package com.ProManage.ProManage.Controller;

import com.ProManage.ProManage.Entity.Task;
import com.ProManage.ProManage.Service.TaskService;
import com.ProManage.ProManage.Entity.TaskRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", maxAge = 3600, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class TaskController {
    private final TaskService taskService;   // ✅ properly injected

    @PostMapping
    public Task createTask(@RequestBody TaskRequest req) {
        return taskService.createTask(req);
    }

    @GetMapping("/project/{id}")
    public List<Task> getTasks(@PathVariable Long id) {
        return taskService.getTasksByProject(id);   // ✅ via service
    }

    @PutMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id,
                             @RequestBody Map<String, String> body) {
        return taskService.updateTaskStatus(id, body.get("status")); // ✅ via service
    }

    @GetMapping("/workspace/{id}")
    public List<Task> getTasksByWorkspace(@PathVariable Long id) {
        return taskService.taskService(id);
    }

    @DeleteMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:5173")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id); // Ensure this method exists in your TaskService
    }
}
