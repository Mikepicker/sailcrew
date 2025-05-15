package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"golang.org/x/net/webdav"
)

var (
	root     string
	port     string
	username string
	password string
)

func main() {
	// === Parse flags ===
	flag.StringVar(&root, "root", "./webdav-root", "Folder to serve")
	flag.StringVar(&port, "port", "1900", "Port to listen on")
	flag.StringVar(&username, "user", "", "Username for Basic Auth (leave empty for no auth)")
	flag.StringVar(&password, "pass", "", "Password for Basic Auth")
	flag.Parse()

	// === Ensure folder exists ===
	if _, err := os.Stat(root); os.IsNotExist(err) {
		os.Mkdir(root, 0755)
	}

	handler := &webdav.Handler{
		Prefix:     "/",
		FileSystem: webdav.Dir(root),
		LockSystem: webdav.NewMemLS(),
	}

	// === Wrap handler with CORS and optional Auth ===
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("📥 %s %s", r.Method, r.URL.Path)
		addCORSHeaders(w, r)

		// Handle preflight
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Optional auth
		if username != "" && password != "" {
			u, p, ok := r.BasicAuth()
			if !ok || u != username || p != password {
				w.Header().Set("WWW-Authenticate", `Basic realm="WebDAV"`)
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
		}

		handler.ServeHTTP(w, r)
	})

	log.Printf("🚀 WebDAV server running at http://localhost:%s/", port)
	log.Printf("📁 Serving folder: %s", root)
	if username != "" {
		log.Printf("🔐 Auth enabled. Username: %s", username)
	} else {
		log.Println("⚠️  No auth enabled")
	}

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func addCORSHeaders(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PROPFIND, MKCOL, MOVE, COPY")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Depth, Authorization, Origin, X-Requested-With")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}
