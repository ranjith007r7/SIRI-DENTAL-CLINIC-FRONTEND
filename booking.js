document.getElementById("date").addEventListener("change", async function () {
    const date = this.value;
    const res = await fetch(`/api/slots/${date}`);
    const slots = await res.json();

    const select = document.getElementById("timeSlot");
    select.innerHTML = "";

    slots.forEach(slot => {
        const opt = document.createElement("option");
        opt.value = slot;
        opt.textContent = slot;
        select.appendChild(opt);
    });
});

document.getElementById("appointmentForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const data = {
        name: name.value,
        phone: phone.value,
        email: email.value,
        date: date.value,
        timeSlot: timeSlot.value,
        problem: problem.value
    };

    const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Appointment booked! Confirmation email sent.");
        this.reset();
    }
});
