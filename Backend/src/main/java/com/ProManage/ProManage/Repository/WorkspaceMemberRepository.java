package com.ProManage.ProManage.Repository;


import com.ProManage.ProManage.Entity.User;
import com.ProManage.ProManage.Entity.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, Long> {
    List<WorkspaceMember> findByUser(User user);

    List<WorkspaceMember> findByWorkspaceId(Long id);
}
