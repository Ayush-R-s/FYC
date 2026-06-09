package com.example.admin.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Status {
    ACTIVE, INACTIVE, SUSPENDED, GRADUATED, EXPIRED;

    @JsonCreator
    public static Status fromString(String value) {
        if (value == null)
            return null;
        try {
            return Status.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    @JsonValue
    public String toValue() {
        // Return capitalized case (e.g., "Active" instead of "ACTIVE") for frontend
        // display if needed,
        // or just return name(). For now keeping it simple as per original, but
        // standardizing.
        // Actually, the frontend expects "Amount" case usually, but let's stick to the
        // name for now
        // or better, let's look at the original Student.java again.
        // The original had:
        /*
         * public enum Status {
         * ACTIVE, INACTIVE, SUSPENDED, GRADUATED;
         * 
         * @JsonCreator
         * public static Status fromString(String value) { ... }
         * }
         */
        // It didn't have @JsonValue. So default is name().
        return name();
    }
}
