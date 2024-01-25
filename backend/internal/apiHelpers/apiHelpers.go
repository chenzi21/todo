package apiHelpers

import (
	"encoding/json"
	"io"
	"log"      // logging messages to the console.
	"net/http" // Used for build HTTP servers and clients.
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func PostRequestGenericChecksAndDataValidation[K any](w http.ResponseWriter, r *http.Request) (data K, err error) {
	enableCors(&w)

	if r.Method != http.MethodPost {
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

func GetRequestGenericChecksAndDataValidation(w http.ResponseWriter, r *http.Request) (data []byte, err error) {
	enableCors(&w)

	if r.Method != http.MethodGet {
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
