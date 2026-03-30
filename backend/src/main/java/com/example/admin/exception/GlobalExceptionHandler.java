package com.example.admin.exception;


import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<java.util.Map<String, String>> handleBadCredentials(org.springframework.security.authentication.BadCredentialsException ex) {
        java.util.Map<String, String> error = new java.util.HashMap<>();
        error.put("message", "Invalid email or password");
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<java.util.Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        System.err.println("IllegalArgumentException caught: " + ex.getMessage());
        ex.printStackTrace();
        logErrorToFile(ex);
        java.util.Map<String, String> error = new java.util.HashMap<>();
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotWritableException.class)
    public ResponseEntity<java.util.Map<String, String>> handleSerializationError(HttpMessageNotWritableException ex) {
        System.err.println("JSON Serialization Error: " + ex.getMessage());
        logErrorToFile(ex);
        java.util.Map<String, String> error = new java.util.HashMap<>();
        error.put("message", "Server serialization error. Check for circular references in entity relationships.");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(org.springframework.web.servlet.NoHandlerFoundException.class)
    public ResponseEntity<java.util.Map<String, String>> handleNotFoundError(org.springframework.web.servlet.NoHandlerFoundException ex) {
        java.util.Map<String, String> error = new java.util.HashMap<>();
        error.put("message", "Endpoint not found: " + ex.getRequestURL());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<java.util.Map<String, String>> handleFileNotFound(FileNotFoundException ex) {
        java.util.Map<String, String> error = new java.util.HashMap<>();
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<java.util.Map<String, String>> handleAllExceptions(Exception ex) {
        ex.printStackTrace();
        logErrorToFile(ex);
        java.util.Map<String, String> error = new java.util.HashMap<>();
        error.put("message", "Backend Error: " + ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void logErrorToFile(Exception ex) {
        try (PrintWriter pw = new PrintWriter(new FileWriter("backend_error.log", true))) {
            pw.println("--- Global Exception Caught ---");
            pw.println("Time: " + new java.util.Date());
            pw.println("Message: " + ex.getMessage());
            ex.printStackTrace(pw);
            pw.println("--------------------------------");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
