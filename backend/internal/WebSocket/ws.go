package WebSocket

import (
	"fmt"      // formatting and printing values to the console.
	"log"      // logging messages to the console.
	"net/http" // Used for build HTTP servers and clients.

	"github.com/gorilla/websocket" // used to upgrade to webSocket
)

var upgrader = websocket.Upgrader{}

func Reader(conn *websocket.Conn) {
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			return
		}

		log.Println(string(p))

		werr := conn.WriteMessage(messageType, p)
		if werr != nil {
			log.Fatal(werr)
			return
		}
	}
}

func Writer() {

}

func GetConnection(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade failed: ", err)
		return conn, err
	} else {
		fmt.Print("HTTP Client has been upgraded to WebSocket")
	}
	return conn, err
}

func Init(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	fmt.Fprintf(w, "ws page")
	conn, err := GetConnection(w, r)
	if err != nil {
		log.Println("Error Getting Connection")
		return conn, err
	}
	Reader(conn)
	defer conn.Close()
	return conn, nil
}
