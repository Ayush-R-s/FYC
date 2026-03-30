package com.example.admin.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

// Force IDE Re-index v2
@Controller
public class SpaController {

    // Forward all non-API and non-static file requests to index.html
    // This allows React Router to handle the routing
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }
}
