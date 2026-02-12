package com.ProManage.ProManage.Controller;

import com.ProManage.ProManage.Entity.User;
import com.ProManage.ProManage.Entity.Workspace;
import com.ProManage.ProManage.Entity.WorkspaceMember;
import com.ProManage.ProManage.Enums.Role;
import com.ProManage.ProManage.Repository.UserRepository;
import com.ProManage.ProManage.Repository.WorkspaceMemberRepository;
import com.ProManage.ProManage.Repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {
    private final WorkspaceRepository workspaceRepo;
    private final WorkspaceMemberRepository memberRepo;
    private final UserRepository userRepo;

    @PostMapping
    public Workspace createWorkspace(@AuthenticationPrincipal Jwt jwt,
                                     @RequestBody Map<String, String> body) {

        User user = userRepo.findByClerkId(jwt.getSubject()).orElseThrow();

        Workspace ws = workspaceRepo.save(
                Workspace.builder()
                        .name(body.get("name"))
                        .owner(user)
                        .build()
        );

        memberRepo.save(
                WorkspaceMember.builder()
                        .workspace(ws)
                        .user(user)
                        .role(Role.ADMIN)
                        .build()
        );

        return ws;
    }

    @GetMapping
    public List<Workspace> myWorkspaces(@AuthenticationPrincipal Jwt jwt) {
        User user = userRepo.findByClerkId(jwt.getSubject()).orElseThrow();
        return memberRepo.findByUser(user)
                .stream()
                .map(WorkspaceMember::getWorkspace)
                .toList();
    }
}
