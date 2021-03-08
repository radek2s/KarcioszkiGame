package com.regster.tajniacy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.regster.tajniacy.model.GameCardPackage;
import com.regster.tajniacy.repository.GameCardPackageRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class GameCardPackageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GameCardPackageRepository service;

    GameCardPackage testPackage;

    @Before
    public void init() {
        testPackage = new GameCardPackage();
        testPackage.setId(1L);
        testPackage.setAuthor("Test");
        testPackage.setPackageName("PackageNameTest");
        testPackage.setPassword("1234");
        testPackage.setPin("0000");
        testPackage.setImage("local");
        testPackage.setVisible(false);
    }

    @Test
    public void postGameCardTest() throws Exception {
        when(service.save(testPackage)).thenReturn(testPackage);
        mockMvc.perform(
                post("/api/card/create")
                        .content(new ObjectMapper().writeValueAsString(testPackage))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void putGameCardTest() throws Exception {
        GameCardPackage put = new GameCardPackage();
        put.setId(1L);
        put.setAuthor("Test");
        put.setPassword("1234");
        put.setPin("0000");
        put.setImage("local");
        put.setVisible(false);

        put.setPackageName("Updated");

        when(service.save(put)).thenReturn(put);
        mockMvc.perform(
                put("/api/card/update/{id}", 1)
                        .content(new ObjectMapper().writeValueAsString(put))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());
    }

    @Test
    public void getAllGameCardsTest() throws Exception {
        mockMvc.perform(get("/api/card/getAll"))
                .andExpect(status().isOk());
    }

    @Test
    public void getOneGameCardsTest() throws Exception {
        when(service.findById(1L)).thenReturn(java.util.Optional.ofNullable(testPackage));
        mockMvc.perform(get("/api/card/get/{id}", 1))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteGameCardTest() throws Exception {
        when(service.findById(1L)).thenReturn(java.util.Optional.ofNullable(testPackage));
        mockMvc.perform(delete("/api/card/delete/{id}", 1))
                .andExpect(status().isOk());
        verify(service, times(1)).delete(testPackage);
    }

}
