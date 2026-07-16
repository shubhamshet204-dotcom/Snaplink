package com.shubham.snaplink.service;

import com.shubham.snaplink.dto.request.RegisterRequest;
import com.shubham.snaplink.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

}