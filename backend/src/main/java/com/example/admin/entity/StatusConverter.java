package com.example.admin.entity;



import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StatusConverter implements AttributeConverter<Status, String> {

    @Override
    public String convertToDatabaseColumn(Status status) {
        if (status == null) {
            return null;
        }
        return status.name(); // Always save as "ACTIVE", "INACTIVE", etc.
    }

    @Override
    public Status convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return Status.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Handle cases where the DB might have unexpected values
            System.err.println("Unknown status in DB: " + dbData);
            return Status.ACTIVE; // Default fallback
        }
    }
}
