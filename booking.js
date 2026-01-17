
const API_BASE = "https://siri-dental-clinic.onrender.com";

const form = document.getElementById("appointmentForm");
const doctorSelect = document.getElementById("doctor");
const dateInput = document.getElementById("date");
const timeSlotSelect = document.getElementById("timeSlot");
const bookBtn = document.getElementById("bookBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");

/* ===========================
   LOAD AVAILABLE TIME SLOTS
=========================== */
async function loadSlots() {
    const doctor = doctorSelect.value;
    const date = dateInput.value;

    if (!doctor || !date) return;

    timeSlotSelect.innerHTML = "<option>Loading...</option>";

    try {
        const res = await fetch(
            `${API_BASE}/api/appointments/availability?doctor=${encodeURIComponent(doctor)}&date=${date}`
        );

        if (!res.ok) throw new Error("Failed to load slots");

        const data = await res.json();

        timeSlotSelect.innerHTML = "";

        if (data.bookedSlots.length === 0) {
            timeSlotSelect.innerHTML = "<option>No slots booked</option>";
            return;
        }

        data.bookedSlots.forEach(slot => {
            const opt = document.createElement("option");
            opt.value = slot;
            opt.textContent = slot;
            timeSlotSelect.appendChild(opt);
        });

    } catch (err) {
        console.error("Slot load error:", err);
        timeSlotSelect.innerHTML = "<option>Error loading slots</option>";
    }
}

doctorSelect.addEventListener("change", loadSlots);
dateInput.addEventListener("change", loadSlots);

/* ===========================
   BOOK APPOINTMENT
=========================== */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("📤 Submit button clicked");

    // Disable button + loader
    bookBtn.disabled = true;
    btnText.style.display = "none";
    btnLoader.style.display = "inline-block";

    const formData = {
        patientName: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        doctor: doctorSelect.value,
        date: dateInput.value,
        timeSlot: timeSlotSelect.value,
        problem: document.getElementById("problem").value.trim()
    };

    console.log("📦 Form data:", formData);

    try {
        const res = await fetch(`${API_BASE}/api/appointments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Booking failed");
        }

        alert("✅ Appointment booked successfully!\nConfirmation email sent.");

        // Reset form
        form.reset();
        timeSlotSelect.innerHTML = "<option>Select Time Slot</option>";

    } catch (err) {
        console.error("❌ Booking error:", err);
        alert("❌ Booking failed. Please try again.");
    } finally {
        // Restore button
        bookBtn.disabled = false;
        btnText.style.display = "inline";
        btnLoader.style.display = "none";
    }
});
