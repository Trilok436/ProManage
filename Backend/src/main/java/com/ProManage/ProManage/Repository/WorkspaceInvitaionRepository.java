package com.ProManage.ProManage.Repository;

import com.ProManage.ProManage.Entity.WorkspaceInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkspaceInvitaionRepository extends JpaRepository<WorkspaceInvitation, Long> {
}
