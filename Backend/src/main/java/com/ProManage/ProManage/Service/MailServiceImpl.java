package com.ProManage.ProManage.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;
    @Override
    public void sendInviteMail(String email,String joinLink, Long workspaceId) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Invitation to Workspace #" + workspaceId);

        message.setText(
                "Hello!\n\n" +
                        "You have been invited to collaborate on a workspace in ProManage.\n" +
                        "Click the link below to accept the invitation and join the team:\n\n" +
                        joinLink + "\n\n" + // This is the http://localhost:5173/join/ID link
                        "If you don't have an account yet, please sign up first using this email address."
        );

        mailSender.send(message);
    }
}