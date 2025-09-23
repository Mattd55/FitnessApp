package com.fitnessapp.dto.mapper;

import com.fitnessapp.dto.response.user.UserResponse;
import com.fitnessapp.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserResponse userToUserResponse(User user);
}