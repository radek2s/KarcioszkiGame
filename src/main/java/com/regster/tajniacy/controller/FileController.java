package com.regster.tajniacy.controller;

import com.regster.tajniacy.model.FileInfo;
import com.regster.tajniacy.service.FileServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/api/files")
public class FileController {

    @Autowired
    private FileServiceImpl fileService;

    @PostMapping("/uploadFile")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes) {
        System.out.println(file.getOriginalFilename());
        try {
            String fileName = fileService.save(file);
            String[] temp;
            if(System.getProperty("os.name").startsWith("Windows")) {
                temp = fileName.replaceAll(Pattern.quote("\\"), "\\\\").split("\\\\");
            } else {
                temp = fileName.split("/");
            }
            return ResponseEntity.ok().body("{\"filename\":\"" + temp[temp.length-1] + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("Upload failed!");
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<FileInfo>> getFiles() {
        List<FileInfo> fileInfos = fileService.loadAll().map(path -> {
            String filename = path.getFileName().toString();
            String url = MvcUriComponentsBuilder.fromMethodName(
                    FileController.class, "getFile", path.getFileName().toString()
            ).build().toString();
            return new FileInfo(filename, url);
        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(fileInfos);
    }

    @GetMapping("/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = fileService.load(filename);
        return ResponseEntity.ok().header(
                HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\""
        ).body(file);
    }

}
