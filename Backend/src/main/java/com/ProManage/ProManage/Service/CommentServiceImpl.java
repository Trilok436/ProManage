package com.ProManage.ProManage.Service;

import com.ProManage.ProManage.Entity.Comment;
import com.ProManage.ProManage.Entity.Task;
import com.ProManage.ProManage.Entity.User;
import com.ProManage.ProManage.Repository.CommentRepository;
import com.ProManage.ProManage.Repository.TaskRepository;
import com.ProManage.ProManage.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService{
    private final CommentRepository commentRepo;
    private final TaskRepository taskRepo;
    private final UserRepository userRepo;
    @Override
    public Comment addComment(long taskId, String content, String clerkId) {
        Task task = taskRepo.findById(taskId).orElseThrow();
        User user = userRepo.findByClerkId(clerkId).orElseThrow();

        return commentRepo.save(
                Comment.builder()
                        .content(content)
                        .task(task)
                        .user(user)
                        .build()
        );
    }

    @Override
    public List<Comment> getComments(Long id) {
        return commentRepo.findByTaskId(id);
    }
}
