package com.ProManage.ProManage.Controller;

import com.ProManage.ProManage.Service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;

    @PostMapping("/invite")
    public void sendInvite(@RequestBody Map<String, Object> body) {
        String email = String.valueOf(body.get("email"));
        String joinLink = String.valueOf(body.get("joinLink"));
        System.out.println(joinLink+"  " + email );
        Object wsIdObj = body.get("workspaceId");
        Long workspaceId = (wsIdObj != null) ? Long.valueOf(wsIdObj.toString()) : 0L;

        mailService.sendInviteMail(email, joinLink, workspaceId);
    }
}