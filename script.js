// Klasa reprezentująca indeks elementu układanki
class PuzzIndex {
    constructor(id, row, column) {
        this.id = id;
        this.row = row;
        this.column = column;
    }
}

// Pusta tablica, nie jest obecnie używana
const indexArray = [];

// Funkcja tasująca elementy tablicy
function mixArray(array) {
    for (let i = 0; i < array.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Funkcja pobierająca aktualną lokalizację użytkownika
function Lokalizator() {
    if (!navigator.geolocation) {
        alert("Nie można kontynuować bez zgody na udostępnienie lokalizacji");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            clearMapMarkers(); // Usuwa istniejące znaczniki na mapie

            const { latitude, longitude } = position.coords;

            mapka.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapka.removeLayer(layer);
                }
            });

            mapka.panTo(new L.LatLng(latitude, longitude)); // Przesuwa mapę do nowej lokalizacji
            L.marker([latitude, longitude]).addTo(mapka); // Dodaje nowy znacznik na mapie
        },
        (positionError) => {
            console.error(positionError);
        },
        {
            enableHighAccuracy: false,
        }
    );
}

// Funkcja obsługująca lokalizację - usuwa istniejące znaczniki na mapie
function handleLocation(position) {
    clearMapMarkers();

    const { latitude, longitude } = position.coords;
    mapka.panTo(new L.LatLng(latitude, longitude));
    L.marker([latitude, longitude]).addTo(mapka);
}

// Funkcja obsługująca błąd lokalizacji
function handleLocationError(error) {
    console.error("Błąd z lokalizacji", error);
}

// Dodaje nasłuchiwanie na przycisk "Pobierz Mapę"
document.getElementById("PrzyciskSavuMapy").addEventListener("click", function () {
    leafletImage(mapka, (err, canvas) => {
        const mapSize = map.getSize();
        const puzzleWidth = mapSize.x / 4;
        const puzzleHeight = mapSize.y / 4;
        const puzzleIndices = createPuzzleIndices();

        mixArray(puzzleIndices);

        // Tworzy elementy puzzli na podstawie tasowanych indeksów
        puzzleIndices.forEach((index) => {
            createPuzzlePiece(index, puzzleWidth, puzzleHeight, canvas);
        });

        addDraggableFunction(); // Dodaje funkcję przeciągania dla puzzli
    });
});

// Funkcja usuwająca istniejące znaczniki na mapie
function clearMapMarkers() {
    mapka.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            mapka.removeLayer(layer);
        }
    });
}

// Funkcja tworząca indeksy puzzli
function createPuzzleIndices() {
    const puzzleIndices = [];
    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
            const id = row * 4 + column;
            puzzleIndices.push(new PuzzIndex(id, row, column));
        }
    }
    return puzzleIndices;
}

// Funkcja tworząca element puzzla
function createPuzzlePiece(index, width, height, canvas) {
    const puzzlePiece = document.createElement("canvas");
    puzzlePiece.draggable = true;
    puzzlePiece.id = `item-${index.id}`;
    puzzlePiece.style.width = `${width}px`;
    puzzlePiece.style.height = `${height}px`;
    puzzlePiece.width = width;
    puzzlePiece.height = height;
    puzzlePiece.style.margin = "0";
    document.body.appendChild(puzzlePiece);

    const context = puzzlePiece.getContext("2d");
    // Rysuje fragment mapy na elemencie puzzla na podstawie indeksu
    context.drawImage(canvas, width * index.column, height * index.row, width, height, 0, 0, width, height);
}

// Funkcja dodająca funkcję przeciągania dla puzzli
function addDraggableFunction() {
    const mainTarget = document.getElementById("Przesuwacz");
    const puzzlePieces = document.querySelectorAll("canvas");

    puzzlePieces.forEach((piece) => {
        piece.addEventListener("dragstart", function (event) {
            this.style.border = "5px dashed #D8D8FF";
            event.dataTransfer.setData("text", this.id);
        });

        piece.addEventListener("dragend", function () {
            this.style.border = "0";
        });

        const target = createDropTarget(piece.style.width, piece.style.height);
        mainTarget.appendChild(target);
    });
}

// Funkcja tworząca obszar przeciągania dla puzzli
function createDropTarget(width, height) {
    const target = document.createElement("div");
    target.draggable = true;
    target.style.height = height;
    target.style.width = width;
    target.style.backgroundColor = "green";
    target.style.border = "1px solid black";
    target.classList.add("drag-target");
    target.addEventListener("dragenter", function () {
        this.style.border = "2px solid #7FE9D9";
    });

    target.addEventListener("dragleave", function () {
        this.style.border = "1px solid black";
    });

    target.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    target.addEventListener("drop", function (event) {
        // Obsługuje upuszczenie puzzla na obszarze przeciągania
        const draggedElement = document.querySelector("#" + event.dataTransfer.getData("text"));
        this.appendChild(draggedElement);
        this.style.border = "1px solid black";
        checkPuzzleSolved();
    }, false);

    return target;
}

// Funkcja sprawdzająca, czy układanka została ułożona
function checkPuzzleSolved() {
    const puzzlePieces = document.querySelectorAll(".drag-target canvas");
    if (puzzlePieces.length === 16) {
        let counter = 0;
        for (const piece of puzzlePieces) {
            const id = piece.id;
            if (`item-${counter}` !== id) {
                return;
            }
            counter++;
        }
        setTimeout(displayWinMessage, 500);
    }
}

// Funkcja wyświetlająca komunikat o wygranej
function displayWinMessage() {
    alert("Wygrałeś!");
    informUser();
}

// Funkcja informująca użytkownika o wygranej
function informUser() {
    if (!("Notification" in window)) {
        alert("Przeglądarka nie obsługuje powiadomień");
    } else if (Notification.permission === "granted") {
        new Notification("Wygrałeś");
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification("Wygrałeś");
            }
        });
    }
}

function showNotification() {
    // Sprawdza, czy przeglądarka obsługuje notyfikacje
    if ('Notification' in window) {
        // Sprawdza, czy użytkownik udzielił zgody na wyświetlanie notyfikacji
        if (Notification.permission === 'granted') {
            // Tworzy nowe powiadomienie
            const notification = new Notification('Układanka ułożona!', {
                body: 'Gratulacje! Puzzlowanie zakończone sukcesem.',
                icon: 'path/do/ikonki.png', // Tutaj możesz podać ścieżkę do własnej ikonki
            });
        } else if (Notification.permission !== 'denied') {
            // Jeśli zgoda nie została udzielona, prosi użytkownika o nią
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    // Jeśli użytkownik udzieli zgody, tworzy notyfikację
                    const notification = new Notification('Układanka ułożona!', {
                        body: 'Gratulacje! Puzzlowanie zakończone sukcesem.',
                        icon: 'path/do/ikonki.png',
                    });
                }
            });
        }
    } else {
        // Jeśli przeglądarka nie obsługuje notyfikacji, wyświetla alert
        alert('Twoja przeglądarka nie obsługuje notyfikacji.');
    }
}

// Wprowadź tę funkcję do odpowiedniego miejsca w kodzie, np. w funkcji checkPuzzleSolved(), po wywołaniu displayWinMessage.

const initialLatitude =45;
const initialLongitude = 60;
const initialZoom = 2;

const map = L.map('map').setView([initialLatitude, initialLongitude], initialZoom);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

map.on('zoom', ({ target }) => {
    zoom = target.getZoom();
});

function notifyMe() {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("To nie wspiera strony");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification("Brawo Wygrales");
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification("Brawo Wygrales ");
          // …
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
}
