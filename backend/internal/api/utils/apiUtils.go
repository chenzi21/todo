package apiUtils

import (
	"encoding/json"
	"io"
	"log"      // logging messages to the console.
	"net/http" // Used for build HTTP servers and clients.
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "https://localhost")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func GetSessionCookie(r *http.Request) (string, error) {
	userId, err := r.Cookie("session");

	if err != nil {
		log.Panic(err)
		return "", err
	}

	return userId.Value, nil
}
func RequestWithSchemaChecksAndDataValidation[K any](w http.ResponseWriter, r *http.Request, m string) (data K, err error) {
	enableCors(&w)

	if r.Method != m {
		log.Println("Method not allowed")
		w.WriteHeader(405) // Return 405 Method Not Allowed.
		return
	}
	// Read request body.
	body, err := io.ReadAll(r.Body)
	
	if err != nil {
		log.Printf("Body read error, %v", err)
		w.WriteHeader(500) // Return 500 Internal Server Error.
		return
	}

	// Parse body as json.
	var schema K

	if err = json.Unmarshal(body, &schema); err != nil {
		log.Printf("Body parse error, %v", err)
		w.WriteHeader(400) // Return 400 Bad Request.
		return
	}

	return schema, err
}

func GetRequestChecksAndDataValidation(w http.ResponseWriter, r *http.Request) (data []byte, err error) {
	enableCors(&w)

	if r.Method != http.MethodGet {
		log.Println("Method not allowed")
		w.WriteHeader(405) // Return 405 Method Not Allowed.
		return
	}
	// Read request body.
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Body read error, %v", err)
		w.WriteHeader(500) // Return 500 Internal Server Error.
		return
	}

	return body, err
}
