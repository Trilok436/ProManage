package com.ProManage.ProManage.Entity;

import com.ProManage.ProManage.Enums.InvitaionStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class WorkspaceInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String role;

    @Enumerated(EnumType.STRING)
    private InvitaionStatus status;

    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;
}