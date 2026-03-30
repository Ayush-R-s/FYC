package com.example.admin.content.controller;


import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.content.dto.TestRequest;
import com.example.admin.content.model.Test;
import com.example.admin.content.service.TestService;


@RestController
@RequestMapping("/admin/content/tests")
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @PostMapping
    public Test createTest(@RequestBody TestRequest request) {
        return testService.createTest(request);
    }

    @GetMapping
    public List<Test> getAllTests() {
        return testService.getAll();
    }

    @PutMapping("/{id}")
    public Test updateTest(@PathVariable Long id, @RequestBody TestRequest request) {
        System.out.println("Updating test ID: " + id + " with title: " + request.getTitle());
        return testService.updateTest(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteTest(@PathVariable Long id) {
        testService.deleteTest(id);
    }
}
