import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import "./App.css";

function App() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(1);

  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 NUEVO

  useEffect(() => {
    fetch("http://localhost:3000/cities")
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReserve = (city) => {
    setSelectedCity(city);
    setTimeout(() => scrollTo("reservas"), 100);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDACIONES
    if (!name.trim()) {
      alert("Por favor ingresa tu nombre");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert("Por favor ingresa un correo válido");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (!date || date < today) {
      alert("Selecciona una fecha válida");
      return;
    }

    if (people < 1) {
      alert("Debe haber al menos 1 persona");
      return;
    }

    if (!selectedCity) {
      alert("Selecciona un destino primero");
      return;
    }

    try {
      setLoading(true); // 🔥 ACTIVA LOADING

      await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityId: selectedCity.id,
          name,
          email,
          date,
          people: Number(people),
        }),
      });

      // 🔥 DESACTIVA LOADING
      setLoading(false);

      // LIMPIAR FORMULARIO
      setName("");
      setEmail("");
      setDate("");
      setPeople(1);
      setSelectedCity(null);

      // MENSAJE
      setSuccessMessage("✅ Reserva realizada con éxito");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      setLoading(false); // 🔥 IMPORTANTE

      console.error("Error al reservar:", error);
      alert("❌ Error al realizar la reserva");
    }
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-title">
          <h2>TravelApp ✈️</h2>
        </div>
        <div className="nav-links">
          <span onClick={() => scrollTo("inicio")}>Inicio</span>
          <span onClick={() => scrollTo("mision")}>Misión y Visión</span>
          <span onClick={() => scrollTo("porque")}>¿Por qué elegirnos?</span>
          <span onClick={() => scrollTo("destinos")}>Destinos</span>
        </div>
      </nav>

      {/* HERO */}
      <div id="inicio" className="hero">
        <video autoPlay loop muted className="hero-video">
          <source src="https://res.cloudinary.com/dm2lrhilm/video/upload/v1773940878/plane_djgyap.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay">
          <h1>ENCUENTRA TU PRÓXIMO DESTINO</h1>
          <p>Reserva viajes fácil, rápido y seguro</p>
        </div>
      </div>

      {/* MISION */}
      <section id="mision" className="section">
        <h2>Misión y Visión</h2>
        <p>
          Nuestra misión es ofrecer experiencias de viaje únicas, accesibles y
          seguras, conectando a las personas con destinos increíbles alrededor
          del mundo.
        </p>
        <p>
          Nuestra visión es convertirnos en una de las agencias de viajes más
          confiables, innovadoras y reconocidas, brindando siempre calidad,
          confianza y atención personalizada.
        </p>
      </section>

      {/* PORQUE */}
      <section id="porque" className="section">
        <h2>¿Por qué elegirnos?</h2>

        <div className="features">
          <div>
            <h3>💰 Precios accesibles</h3>
            <p>
              Ofrecemos las mejores tarifas del mercado sin comprometer la
              calidad.
            </p>
          </div>

          <div>
            <h3>🤝 Atención personalizada</h3>
            <p>
              Te acompañamos en cada paso para que tu experiencia sea perfecta.
            </p>
          </div>

          <div>
            <h3>🔒 Seguridad garantizada</h3>
            <p>
              Trabajamos con plataformas seguras y confiables para tu
              tranquilidad.
            </p>
          </div>
        </div>
      </section>

      {/* DESTINOS */}
      <div id="destinos" className="container">
        <h1 className="main-title">DESTINOS DISPONIBLES</h1>
        <div className="cities-grid">
          {cities.map((city) => (
            <div key={city.id} className="city-card">
              {city.image && <img src={city.image} alt={city.name} />}
              <h2>{city.name}</h2>
              <p>${city.price.toLocaleString()}</p>
              <button onClick={() => handleReserve(city)}>
                Reservar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MENSAJE */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {/* FORMULARIO */}
      {selectedCity && (
        <div id="reservas" className="reservation-form">
          <h2>Reservar viaje a {selectedCity.name}</h2>

          <form onSubmit={handleBookingSubmit}>
            <label>Nombre y apellidos</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <label>Personas</label>
            <input
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              min="1"
            />

            {/* 🔥 BOTÓN PRO */}
            <button disabled={loading}>
              {loading ? "Procesando..." : "Confirmar"}
            </button>
          </form>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-item">
            <h3>OFICINA NEIVA</h3>
            <p>Calle 76 # 1 a 75, Norte Neiva</p>
          </div>

          <div className="footer-item">
            <h3>CONTÁCTANOS</h3>
            <p>📞3013991153</p>
          </div>

          <div className="footer-item">
            <h3>HORARIOS</h3>
            <p>Lunes a Viernes: 7:30 AM - 6:00 PM</p>
          </div>

          <div className="footer-item">
            <h3>SÍGUENOS</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com/sebastianmedina07" target="_blank" rel="noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://www.instagram.com/sbastianmedina.8" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
              <a href="https://www.tiktok.com/@sbastian.8" target="_blank" rel="noreferrer">
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>

        <p className="copy">© 2026 TravelApp</p>
      </footer>

      {/* WHATSAPP */}
      <a
        href="https://wa.me/573013991153"
        target="_blank"
        rel="noreferrer"
        className="whatsapp"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}

export default App;