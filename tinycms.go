// Tinycms broadcasts view and edit functions for html
package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var db map[string]string

// add some user auth?
// add some csrf auth?
// make some html templates?
func main() {
	db = make(map[string]string)
	r := mux.NewRouter()
	r.HandleFunc("/index.html", servePage("index.html"))
	r.PathPrefix("/view/").HandlerFunc(view)
	r.PathPrefix("/edit/").HandlerFunc(edit)
	http.Handle("/", r)
	log.Fatal(http.ListenAndServe("localhost:8000", nil))
}

func servePage(filename string) func(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		log.Fatalf("servePage: %v\n", err)
	}
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		_, _ = w.Write(data)
	}
}

func view(w http.ResponseWriter, r *http.Request) {
	k := r.RequestURI[6:]
	v := db[k]
	fmt.Printf("Getting db[%#v]=%#v\n", k, v)
	w.Header().Set("Content-Type", "text/html")
	_, _ = w.Write([]byte(v))
}

func edit(w http.ResponseWriter, r *http.Request) {
	k := r.RequestURI[6:]
	v := r.FormValue("data")
	fmt.Printf("writing db[%#v]=%#v\n", k, v)
	db[k] = v
}
