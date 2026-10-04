package com.inventory.app.service;

import com.inventory.app.dto.LoginRequest;
import com.inventory.app.dto.RegisterRequest;
import com.inventory.app.dto.Response;
import com.inventory.app.dto.UserDto;
import com.inventory.app.entity.User;

public interface UserService {

    Response registerUser(RegisterRequest registerRequest);

    Response loginUser(LoginRequest loginRequest);

    Response getAllUsers();

    User getCurrentLoggedInUser();

    Response updateUser(Long id, UserDto userDto);

    Response deleteUser(Long id);

    Response getUserTransactions(Long id);

}
