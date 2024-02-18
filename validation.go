package main

import (
	"errors"
	"regexp"
	"time"
)

func CreateBookingValidation(booking *BookingRequest) error {
	// Ensure required fields are not empty.
	if booking.ClientName == "" {
		return errors.New("client name is required")
	}
	if booking.ClientEmail == "" {
		return errors.New("client email is required")
	} else {
		// Simple email format validation
		if match, _ := regexp.MatchString(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`, booking.ClientEmail); !match {
			return errors.New("client email is not in a valid format")
		}
	}
	if booking.ClientPhone == "" {
		return errors.New("client phone is required")
	}
	if booking.BookingTime == "" {
		return errors.New("booking time is required")
	} else {
		// Validate booking time format (ISO 8601)
		if _, err := time.Parse(time.RFC3339, booking.BookingTime); err != nil {
			return errors.New("booking time is not in a valid ISO 8601 format")
		}
	}
	if booking.ServiceType == "" {
		return errors.New("service type is required")
	}

	// Validate the OriginalPrice, DiscountAmount, and FinalPrice
	if booking.OriginalPrice <= 0 {
		return errors.New("original price must be greater than 0")
	}
	if booking.DiscountAmount < 0 {
		return errors.New("discount amount cannot be negative")
	}
	if booking.FinalPrice <= 0 {
		return errors.New("final price must be greater than 0")
	}
	if booking.FinalPrice != booking.OriginalPrice-booking.DiscountAmount {
		return errors.New("final price does not match the original price minus discount amount")
	}

	return nil
}
