class Customer {
    constructor(id,name,email){
        this.id=id;
        this.name=name;
        this.email=email;
    }
    get info(){
        return  this.name + " | Correo: "+this.email; 
    }
}

class Reservation {

    constructor(id,customer,date,guests){
        this.id=id;
        this.customer=customer;
        this.date=new Date(date);
        this.guests=guests;
    }
    get info(){
        const cita= this.date;
        const year = cita.getFullYear();        // Año
        const month = cita.getMonth() + 1;      // Mes (0-11, por lo que añadimos 1)
        const day = cita.getDate();             // Día del mes (1-31)
        const hours = cita.getHours();          // Hora (0-23)
        const minutes = cita.getMinutes();      // Minutos (0-59)
        return `Date: ${day}/${month}/${year} Hour: ${hours}:${minutes}. Customer: ${this.customer.info}. Guests: ${this.guests}`;
    }
    static validateReservation(obj){
          const {fecha, comensales} = obj;
          const actualDate = new Date();
            if (new Date(fecha)<actualDate || comensales <= 0){
                return false;
            }
            return true;
    }
}

class Restaurant {
    constructor(name) {
        this.name = name;
        this.reservations = [];
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    render() {
        const container = document.getElementById("reservations-list");
        container.innerHTML = "";
        this.reservations.forEach((reservation) => {
            const reservationCard = document.createElement("div");
            reservationCard.className = "box";
            reservationCard.innerHTML = `
                    <p class="subtitle has-text-primary">
                        Reserva ${
                            reservation.id
                        } - ${reservation.date.toLocaleString()}
                    </p>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                ${reservation.info}
                            </p>
                        </div>
                    </div>
              `;
            container.appendChild(reservationCard);
        });
    }
}

document
    .getElementById("reservation-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value;
        const customerEmail = document.getElementById("customer-email").value;
        const reservationDate =
            document.getElementById("reservation-date").value;
        const guests = parseInt(document.getElementById("guests").value);

        if (Reservation.validateReservation(reservationDate, guests)) {
            const customerId = restaurant.reservations.length + 1;
            const reservationId = restaurant.reservations.length + 1;

            const customer = new Customer(
                customerId,
                customerName,
                customerEmail
            );
            const reservation = new Reservation(
                reservationId,
                customer,
                reservationDate,
                guests
            );

            restaurant.addReservation(reservation);
            restaurant.render();
        } else {
            alert("Datos de reserva inválidos");
            return;
        }
    });

const restaurant = new Restaurant("El Lojal Kolinar");

const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);

if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
    restaurant.addReservation(reservation1);
    restaurant.render();
} else {
    alert("Datos de reserva inválidos");
}
