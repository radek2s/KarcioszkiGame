package com.regster.tajniacy.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    /**
     * Redirect to Angular routing
     * When user enter try to open /hub page open this page in AngularApp
     */
    @RequestMapping(value = "/**/{path:[^.]*}")
    public String redirect() {
        return "forward:/";
    }


}
