package com.fitnessapp.dto.mapper;

import com.fitnessapp.dto.response.user.UserResponse;
import com.fitnessapp.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse userToUserResponse(User user) {
        if (user == null) {
            return null;
        }

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole());
        response.setEnabled(user.isEnabled());
        response.setAccountNonExpired(user.isAccountNonExpired());
        response.setAccountNonLocked(user.isAccountNonLocked());
        response.setCredentialsNonExpired(user.isCredentialsNonExpired());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        return response;
    }
}