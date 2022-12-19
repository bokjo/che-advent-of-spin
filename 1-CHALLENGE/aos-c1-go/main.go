package main

import (
	"fmt"
	"net/http"

	spinhttp "github.com/fermyon/spin/sdk/go/http"
)

type Message struct {
	Message string `json:"message"`
}

func init() {
	spinhttp.Handle(func(w http.ResponseWriter, r *http.Request) {
		// message := &Message{Message: "Hello World!"}

		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintln(w, "{\"message\": \"Hello World!\"}")
	})
}

func main() {}
