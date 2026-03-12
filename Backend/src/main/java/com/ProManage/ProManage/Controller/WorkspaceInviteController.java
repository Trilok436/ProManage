package com.ProManage.ProManage.Controller;

import com.ProManage.ProManage.Entity.WorkspaceInvitation;
import com.ProManage.ProManage.Enums.InvitaionStatus;
import com.ProManage.ProManage.Service.WorkspaceInviteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceInviteController {
    private final WorkspaceInviteService service;
    private final RestTemplate restTemplate;
    @PostMapping("/{id}/invite")
    public void invite(@PathVariable Long id,
                       @RequestBody Map<String, String> body) {

        var invitation = service.invite(
                id,
                body.get("email"),
                body.get("role")
        );

        // 🔥 Call Inngest here with invitation.getId()
        String inngestUrl = "https://inn.gs/e/IwpSLvKW4JKzRnJ9HC6ZVS4kGbYlizhWt_YVe2zqJHSQZwRunhb0anEesny4lHFZLuwGydjfPF84-Q-M3OLshA";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> payload = Map.of(
                "name", "workspace/invite",
                "data", Map.of(
                        "inviteId", invitation.getId(),
                        "email", body.get("email"),
                        "workspaceId", id
                )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
    try {
        restTemplate.postForObject(inngestUrl, request, String.class);
        System.out.println("Event sent to inngest local");
    }catch (Exception e){
        System.out.println("failed to send to inngest" + e.getMessage());
    }
        }
    @PostMapping("/invites/{inviteId}/accept")
    public ResponseEntity<?> acceptInvite(@PathVariable Long inviteId, Principal principal) {
        // 1. Get the Clerk ID from the authenticated principal
        // principal.getName() usually returns the 'sub' claim (the Clerk ID)
        String clerkId = principal.getName();

        // 2. Find the invite
        WorkspaceInvitation invite = service.getInviteById(inviteId);

        if (invite.getStatus() == InvitaionStatus.ACCEPTED) {
            return ResponseEntity.badRequest().body("Invitation already used.");
        }

        try {
            // 3. Pass both the invite AND the clerkId to the service
            service.completeInvitation(invite, clerkId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
