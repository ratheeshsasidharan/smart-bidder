package com.smartbidder.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
public class HeaderUtil {

    private HeaderUtil() {
    }

    public static HttpHeaders createAlert(String applicationName, String message, String param) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-" + applicationName + "-alert", message);
        try {
            headers.add("X-" + applicationName + "-params", URLEncoder.encode(param, StandardCharsets.UTF_8.toString()));
        } catch (UnsupportedEncodingException var5) {
        }

        return headers;
    }

    public static HttpHeaders createAlert(String message, String param) {
        return createAlert("smart-bidding",message,param);
    }

    public static HttpHeaders createEntityCreationAlert(String entityName, String param) {
        return createEntityCreationAlert("smart-bidding",entityName,param);
    }

    public static HttpHeaders createEntityCreationAlert(String applicationName, String entityName, String param) {
        String message = entityName + " created with identifier " + param;
        return createAlert(applicationName, message, param);
    }

    public static HttpHeaders createEntityUpdateAlert(String entityName, String param) {
        String message = entityName+" with identifier "+ param + " is updated";
        return createAlert("smart-bidding", message, param);
    }

    public static HttpHeaders createEntityUpdateAlert(String applicationName, String entityName, String param) {
        String message = entityName+" with identifier "+ param + " is updated";
        return createAlert(applicationName, message, param);
    }

    public static HttpHeaders createEntityDeletionAlert(String entityName, String param) {
        return createEntityDeletionAlert("smart-bidding",entityName,param);
    }

    public static HttpHeaders createEntityDeletionAlert(String applicationName, String entityName, String param) {
        String message = "A " + entityName + " is deleted with identifier " + param;
        return createAlert(applicationName, message, param);
    }

    public static HttpHeaders createFailureAlert(String applicationName, String entityName, String errorKey, String defaultMessage) {
        log.error("Entity processing failed, {}", defaultMessage);
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-" + applicationName + "-error", defaultMessage);
        headers.add("X-" + applicationName + "-params", entityName);
        return headers;
    }

    public static HttpHeaders createFailureAlert(String entityName, String errorKey, String defaultMessage) {
        return createFailureAlert("smart-bidding",entityName,errorKey,defaultMessage);
    }
}
