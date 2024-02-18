package main

import (
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// BookingRequest struct captures booking details from the frontend.
type BookingRequest struct {
	ID             uint    `gorm:"primaryKey"` // Add ID for primary key
	MassagerID     string  `json:"massager_id"`
	ClientName     string  `json:"client_name"`
	ClientEmail    string  `json:"client_email"`
	ClientPhone    string  `json:"client_phone"`
	BookingTime    string  `json:"booking_time"` // ISO 8601 format
	ServiceType    string  `json:"service_type"`
	Notes          string  `json:"notes,omitempty"`  // Optional
	Age            *int    `json:"age,omitempty"`    // Optional
	Gender         *string `json:"gender,omitempty"` // Optional
	RemindByEmail  bool    `json:"remind_by_email"`
	RemindByPhone  bool    `json:"remind_by_phone"`
	DiscountCode   string  `json:"discount_code,omitempty"` // Optional
	OriginalPrice  float64 `json:"original_price"`
	DiscountAmount float64 `json:"discount_amount,omitempty"` // Optional
	FinalPrice     float64 `json:"final_price"`
}

type Massager struct {
	gorm.Model
	Name           string
	Email          string `gorm:"unique"`
	Phone          string
	PasswordHash   string
	Services       []Service `gorm:"many2many:massager_services;"`
	Companies      []Company `gorm:"many2many:company_massagers;"`
	Availabilities []Availability
}

type Company struct {
	gorm.Model
	Name      string
	Address   string
	Massagers []Massager `gorm:"many2many:company_massagers;"`
}

type Availability struct {
	ID         uint `gorm:"primaryKey"`
	MassagerID uint
	StartTime  time.Time
	EndTime    time.Time
}

// Many-to-Many relationship for Massager and Service (assuming you have a Service model)
type Service struct {
	gorm.Model
	Name        string
	Description string
	Massagers   []Massager `gorm:"many2many:massager_services;"`
}

// Define a struct to encapsulate your claims. You can extend this struct with more fields as needed.
type Claims struct {
	MassagerID uint
	Email      string `json:"email"`
	jwt.StandardClaims
}

type Repository struct {
	DB *gorm.DB
}

// NewRepository creates a new repository with a given gorm.DB connection.
func NewRepository(db *gorm.DB) *Repository {
	return &Repository{DB: db}
}

func (r *Repository) SetUpRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Post("/bookings", r.CreateBooking)
	api.Get("/bookings", r.GetAllBookings)
	api.Get("/bookings/:id", r.GetBookingByID)
	api.Get("/massager/:massager_id/bookings", r.GetBookingsByMassager)
	api.Put("/bookings/:id", r.UpdateBooking)
	api.Delete("/bookings/:id", r.DeleteBooking)
}

func main() {

	// Load the .env file
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }

	// Setup database connection with gorm using variables from .env
	dsn := "host=" + os.Getenv("DB_HOST") +
		" user=" + os.Getenv("POSTGRES_USER") +
		" dbname=" + os.Getenv("POSTGRES_DB") +
		" sslmode=disable password=" + os.Getenv("POSTGRES_PASSWORD") +
		" port=5432"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database", err)
	}

	// Perform database migration to ensure the tables match our models
	if err := db.AutoMigrate(&BookingRequest{}); err != nil {
		log.Fatal("failed to migrate database", err)
	}

	// Initialize fiber
	app := fiber.New()

	// Setup routes with repository pattern
	repo := NewRepository(db)
	repo.SetUpRoutes(app)

	// Start fiber server
	log.Fatal(app.Listen(":8080"))
}

// CreateBooking handles POST requests to create a new booking.
func (r *Repository) CreateBooking(c *fiber.Ctx) error {
	var booking BookingRequest

	if err := c.BodyParser(&booking); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	// Call the validation function.
	if err := CreateBookingValidation(&booking); err != nil {
		// If validation fails, return a 422 Unprocessable Entity status, indicating a validation error.
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"error": err.Error()})
	}

	if result := r.DB.Create(&booking); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create booking"})
	}

	return c.Status(fiber.StatusCreated).JSON(booking)
}

// GetAllBookings retrieves all bookings from the database.
func (r *Repository) GetAllBookings(c *fiber.Ctx) error {
	var bookings []BookingRequest
	if result := r.DB.Find(&bookings); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not fetch bookings"})
	}
	return c.JSON(bookings)
}

// GetBookingByID retrieves a booking by its ID.
func (r *Repository) GetBookingByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var booking BookingRequest
	if result := r.DB.First(&booking, id); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Booking not found"})
	}
	return c.JSON(booking)
}

// UpdateBooking updates the details of an existing booking.
func (r *Repository) UpdateBooking(c *fiber.Ctx) error {
	id := c.Params("id")
	var booking BookingRequest
	if err := r.DB.First(&booking, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Booking not found"})
	}

	var update BookingRequest
	if err := c.BodyParser(&update); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	r.DB.Model(&booking).Updates(update)
	return c.JSON(booking)
}

// DeleteBooking deletes a booking from the database.
func (r *Repository) DeleteBooking(c *fiber.Ctx) error {
	id := c.Params("id")
	var booking BookingRequest
	if result := r.DB.Delete(&booking, id); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Booking not found"})
	}
	return c.SendStatus(fiber.StatusNoContent)
}

// GetBookingsByMassager retrieves all bookings for a specific massager.
func (r *Repository) GetBookingsByMassager(c *fiber.Ctx) error {
	massagerID := c.Params("massager_id")
	var bookings []BookingRequest
	if result := r.DB.Where("massager_id = ?", massagerID).Find(&bookings); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not fetch bookings for massager"})
	}
	return c.JSON(bookings)
}

// HashPassword hashes the given password using bcrypt.
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// RegisterMassager creates a new massager account with hashed password.
func (r *Repository) RegisterMassager(c *fiber.Ctx) error {
	var massager Massager
	if err := c.BodyParser(&massager); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	hashedPassword, err := HashPassword(massager.PasswordHash) // Assuming the request contains the password in PasswordHash
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not hash password"})
	}
	massager.PasswordHash = hashedPassword

	if result := r.DB.Create(&massager); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not register massager"})
	}

	return c.Status(fiber.StatusCreated).JSON(massager)
}

// CheckPasswordHash compares the plain password with the hashed password.
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// LoginMassager checks massager credentials and returns a JWT if successful.
func (r *Repository) LoginMassager(c *fiber.Ctx) error {
	var loginInfo struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&loginInfo); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	var massager Massager
	if result := r.DB.Where("email = ?", loginInfo.Email).First(&massager); result.Error != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid login credentials"})
	}

	if !CheckPasswordHash(loginInfo.Password, massager.PasswordHash) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid login credentials"})
	}

	// Generate JWT token for the authenticated user
	tokenString, err := GenerateJWT(massager.ID, massager.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{"token": tokenString})
}

// Secret key used to sign the tokens. Ensure this is kept secure and not hard-coded in a real application.
var jwtKey = []byte("jacobstad_secrets")

// GenerateJWT generates a new JWT token for a given user.
func GenerateJWT(massagerID uint, email string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour) // Token is valid for 1 day
	claims := &Claims{
		MassagerID: massagerID,
		Email:      email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}
