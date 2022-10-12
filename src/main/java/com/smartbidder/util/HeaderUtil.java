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

    public static HttpHeaders createEntityCreationAlert(boolean enableTranslation, String entityName, String param) {
        return createEntityCreationAlert("smart-bidding",enableTranslation,entityName,param);
    }

    public static HttpHeaders createEntityCreationAlert(String applicationName, boolean enableTranslation, String entityName, String param) {
        String message = enableTranslation ? applicationName + "." + entityName + ".created" : "A new " + entityName + " is created with identifier " + param;
        return createAlert(applicationName, message, param);
    }

    public static HttpHeaders createEntityUpdateAlert(boolean enableTranslation, String entityName, String param) {
        return createEntityCreationAlert("smart-bidding",enableTranslation,entityName,param);
    }

    public static HttpHeaders createEntityUpdateAlert(String applicationName, boolean enableTranslation, String entityName, String param) {
        String message = enableTranslation ? applicationName + "." + entityName + ".updated" : "A " + entityName + " is updated with identifier " + param;
        return createAlert(applicationName, message, param);
    }

    public static HttpHeaders createEntityDeletionAlert(boolean enableTranslation, String entityName, String param) {
        return createEntityDeletionAlert("smart-bidding",enableTranslation,entityName,param);
    }

    public static HttpHeaders createEntityDeletionAlert(String applicationName, boolean enableTranslation, String entityName, String param) {
        String message = enableTranslation ? applicationName + "." + entityName + ".deleted" : "A " + entityName + " is deleted with identifier " + param;
        return createAlert(applicationName, message, param);
    }

    public static HttpHeaders createFailureAlert(String applicationName, boolean enableTranslation, String entityName, String errorKey, String defaultMessage) {
        log.error("Entity processing failed, {}", defaultMessage);
        String message = enableTranslation ? "error." + errorKey : defaultMessage;
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-" + applicationName + "-error", message);
        headers.add("X-" + applicationName + "-params", entityName);
        return headers;
    }

    public static HttpHeaders createFailureAlert(boolean enableTranslation, String entityName, String errorKey, String defaultMessage) {
        return createFailureAlert("smart-bidding",enableTranslation,entityName,errorKey,defaultMessage);
    }
}
