package com.ProManage.ProManage.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

import java.util.Map;

@Service
public class InngestService {
    @Value("${inngest.event.key}")
private String eventKey;

    public void sendEvent(String eventName, Map<String, Object> data) {

        try {
            String body = """
            {
              "name": "%s",
              "data": %s
            }
            """.formatted(eventName, new ObjectMapper().writeValueAsString(data));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.inngest.com/e/" + eventKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("event is sent to inngest");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}