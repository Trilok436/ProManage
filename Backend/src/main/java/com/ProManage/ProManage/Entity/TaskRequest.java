package com.ProManage.ProManage.Entity;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    private Long projectId;
    private Long assigneeId;

    private String title;
    private String description;
    private String priority;
    private String status;
    private String type;
    private LocalDate dueDate;
}
