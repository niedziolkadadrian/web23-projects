# Projekt node-js

## Uruchamianie Projektu
- Sklonuj repozytorium na swój lokalny komputer
- W terminalu wejdź do katalogu projektu
     ```bash
     cd web23-projects/nodejs-project
     ```
- Zainstaluj zależności projektu z pliku `package.json`:
     ```bash
     npm install
     ```
- Uruchom aplikację, korzystając z odpowiedniej komendy startowej (sprawdź plik `package.json`):
     ```bash
     npm start
     ```
     Lub
     ```bash
     node server.js
     ```
- Przejdź do przeglądarki i otwórz aplikację pod adresem `http://localhost:8080`

## Postman
Aplikacja ma także udostępnione api Restowe, które można przetestować za pomocą Postmana.
Aby to zrobić:
- przejdź do Postmana
- bedąc w jakimś Workspacie, kliknij import
- wgraj plik NodeJs-project.postman_collection.json znajdujący się w repozytorium
- endpointy są w różnych plikach ścieżkach. Większość jest zabezpieczona, dlatego należy w zakładce **Authorization** wybrać typ uwierzytelniania na **Bearer token** i wpisać access token uzyskany po podaniu emailu i hasła na endpoincie **login**.