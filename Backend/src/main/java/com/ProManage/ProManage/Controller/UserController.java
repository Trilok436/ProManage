package com.ProManage.ProManage.Controller;

import com.ProManage.ProManage.Entity.User;
import com.ProManage.ProManage.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @PostMapping("/sync")
    public User syncUser(@AuthenticationPrincipal Jwt jwt) {
        System.out.println("DEBUG - ALL CLAIMS: "+ jwt.getClaims());
        String clerkId = jwt.getSubject();
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");
        String photoUrl = jwt.getClaimAsString("imageUrl");
        System.out.println("PhotoUrl " + photoUrl);
        System.out.println("email "+email);
        System.out.println("Name "+name);
        if (email == null) {
            throw new RuntimeException("Email claim is missing from JWT. Check Clerk Dashboard Settings.");
        }


        return userRepository.findByClerkId(clerkId)
                .map(existingUser -> {
                    // Update if the existing record has NULL values
                    if (existingUser.getEmail() == null && email != null) {
                        existingUser.setEmail(email);
                        existingUser.setName(name);
                        return userRepository.save(existingUser);
                    }
                    if (existingUser.getName() == null) existingUser.setName(name);
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .clerkId(clerkId)
                                .email(email)
                                .name(name)
                                .build()
                ));
    }
}
