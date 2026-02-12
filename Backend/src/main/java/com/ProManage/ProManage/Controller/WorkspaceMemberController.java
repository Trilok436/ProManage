package com.ProManage.ProManage.Controller;

import com.ProManage.ProManage.Entity.WorkspaceMember;
import com.ProManage.ProManage.Repository.WorkspaceMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces/{id}/members")
@RequiredArgsConstructor

public class WorkspaceMemberController {

    private final WorkspaceMemberRepository repo;

    @GetMapping
    public List<WorkspaceMember> members(@PathVariable Long id) {
        return repo.findByWorkspaceId(id);
    }
}
