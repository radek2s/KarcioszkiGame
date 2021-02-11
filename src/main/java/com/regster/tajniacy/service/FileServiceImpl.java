package com.regster.tajniacy.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.stream.Stream;

@Service
public class FileServiceImpl implements FileService {

    @Value("${app.upload.dir:${user.home}}")
    public String uploadDirectory;

    @Override
    public String save(MultipartFile file) {

            try {
                Path copyLocation = Paths.get(uploadDirectory + File.separator + StringUtils.cleanPath(file.getOriginalFilename()));
                File tempFile = new File(copyLocation.toString());
                int counter = 1;
                while(tempFile.exists()) {
                    copyLocation = Paths.get(uploadDirectory + File.separator + counter + StringUtils.cleanPath(file.getOriginalFilename()));
                    tempFile = new File(copyLocation.toString());
                    counter++;
                }
                Files.copy(file.getInputStream(), copyLocation, StandardCopyOption.REPLACE_EXISTING);
                return copyLocation.toString();
            } catch (NoSuchFileException e) {
                try {
                    Files.createDirectory(Paths.get(uploadDirectory));
                    Path copyLocation = Paths.get(uploadDirectory + File.separator + StringUtils.cleanPath(file.getOriginalFilename()));
                    Files.copy(file.getInputStream(), copyLocation, StandardCopyOption.REPLACE_EXISTING);
                    return copyLocation.toString();
                } catch (Exception ex) {
                    throw new RuntimeException("Could not save file." + ex.getMessage());
                }
            } catch (Exception e) {
                throw new RuntimeException("Could not save file." + e.getMessage());
            }

    }

    @Override
    public Resource load(String filename) {
        try {
            Path file = Paths.get(uploadDirectory + File.separator + filename);
            Resource r = new UrlResource(file.toUri());

            if(r.exists() || r.isReadable()) {
                return r;
            } else {
                throw new RuntimeException("Could not read file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error " + e.getMessage());
        }
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            Path dir = Paths.get(uploadDirectory + File.separator);
            return Files.walk(dir, 1).filter(path -> !path.equals(dir)).map(dir::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load files");
        }
    }
}
