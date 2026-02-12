package com.ProManage.ProManage.Service;

import com.ProManage.ProManage.Entity.WorkspaceInvitation;

public interface WorkspaceInviteService {
    WorkspaceInvitation invite(Long id, String email, String role);

    WorkspaceInvitation getInviteById(Long inviteId);

    void completeInvitation(WorkspaceInvitation invite, String clerkId);
}
