package com.ProManage.ProManage.Controller;

import com.ProManage.ProManage.Entity.Comment;
import com.ProManage.ProManage.Service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public Comment addComment(@AuthenticationPrincipal Jwt jwt,
                              @RequestBody Map<String, String> body) {

        return commentService.addComment(
                Long.parseLong(body.get("taskId")),
                body.get("content"),
                jwt.getSubject()
        );
    }

    @GetMapping("/task/{id}")
    public List<Comment> getComments(@PathVariable Long id) {
        return commentService.getComments(id);
    }
}
