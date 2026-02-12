package com.ProManage.ProManage.Service;

public interface MailService {
    void sendInviteMail(String email, String joinLink, Long workSpaceId);
}
