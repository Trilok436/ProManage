package com.ProManage.ProManage.Repository;

import com.ProManage.ProManage.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository  extends JpaRepository<User, Long>{
    Optional<User> findByClerkId(String clerkId);

    Optional<User> findByEmail(String email);
}
