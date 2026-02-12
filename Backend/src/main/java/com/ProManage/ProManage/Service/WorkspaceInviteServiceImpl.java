package com.ProManage.ProManage.Service;

import com.ProManage.ProManage.Entity.User;
import com.ProManage.ProManage.Entity.Workspace;
import com.ProManage.ProManage.Entity.WorkspaceInvitation;
import com.ProManage.ProManage.Entity.WorkspaceMember;
import com.ProManage.ProManage.Enums.Role;
import com.ProManage.ProManage.Repository.UserRepository;
import com.ProManage.ProManage.Repository.WorkspaceInvitaionRepository;
import com.ProManage.ProManage.Repository.WorkspaceMemberRepository;
import com.ProManage.ProManage.Repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.ProManage.ProManage.Enums.InvitaionStatus;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor

public class WorkspaceInviteServiceImpl implements WorkspaceInviteService{
    private final WorkspaceRepository workspaceRepo;
    private final WorkspaceInvitaionRepository inviteRepo;

    public WorkspaceInvitation invite(Long workspaceId, String email, String role) {

        Workspace workspace = workspaceRepo.findById(workspaceId)
                .orElseThrow();

        WorkspaceInvitation invitation = WorkspaceInvitation.builder()
                .email(email)
                .role(role)
                .workspace(workspace)
                .status(InvitaionStatus.PENDING)
                .build();

        return inviteRepo.save(invitation);
    }

    @Override
    public WorkspaceInvitation getInviteById(Long inviteId) {
        return inviteRepo.findById(inviteId).orElseThrow(() -> new RuntimeException("Invitaion Not Found For Id : "+ inviteId));
    }

    // Inject the WorkspaceMemberRepository at the top
    private final WorkspaceMemberRepository memberRepo;
    private final UserRepository userRepo; // You'll need this to find the person

    @Override
    @Transactional // Always use Transactional when modifying multiple tables
    public void completeInvitation(WorkspaceInvitation invite, String clerkId) {
        // Find the user by Clerk ID (the person currently clicking the link)
        User user = userRepo.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("User not found in database. Ensure sync is complete."));

        // Verify email matches the invitation
        if (!invite.getEmail().equalsIgnoreCase(user.getEmail())) {
            throw new RuntimeException("This invitation was intended for " + invite.getEmail());
        }

        // Convert role string (e.g., "org:admin") to Enum (ADMIN)
        String roleStr = invite.getRole().replace("org:", "").toUpperCase();
        Role roleEnum = Role.valueOf(roleStr);

        // Create the membership
        WorkspaceMember membership = WorkspaceMember.builder()
                .workspace(invite.getWorkspace())
                .user(user)
                .role(roleEnum)
                .build();

        memberRepo.save(membership);

        // Update and save invite status
        invite.setStatus(InvitaionStatus.ACCEPTED);
        inviteRepo.save(invite);
    }
}
