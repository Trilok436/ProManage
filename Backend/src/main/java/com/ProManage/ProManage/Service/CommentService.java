package com.ProManage.ProManage.Service;

import com.ProManage.ProManage.Entity.Comment;

import java.util.List;

public interface CommentService {
    Comment addComment(long taskId, String content, String clerkId);

    List<Comment> getComments(Long id);
}
