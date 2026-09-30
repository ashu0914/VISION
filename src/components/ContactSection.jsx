import { useState } from "react";
import "./ContactSection.css";
import ButtonWithIcon from "./ButtonWithIcon";

// TODO: swap these for your real inbox / number before you ship.
const CONTACT_EMAIL = "hello@vision.trip";
const CONTACT_PHONE = "+91 98765 43210";

export default function ContactSection() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [form, setForm] = useState({ name: "", email: "", trip: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Wire this up to whatever sends the email — Formspree, Resend, EmailJS, your
    // own API route, etc. Example with Formspree:
    //
    // await fetch("https://formspree.io/f/xxxxxxx", {
    //   method: "POST",
    //   headers: { Accept: "application/json" },
    //   body: new FormData(e.target),
    // });

    await new Promise((r) => setTimeout(r, 500)); // placeholder — remove once wired up
    setStatus("sent");
    setForm({ name: "", email: "", trip: "", message: "" });
  };

  return (
    <section id="Contact" className="content-section contact-section">
      <div className="content-section__inner contact-section__inner">
        <div className="contact-info">
          <p className="content-eyebrow">Get in touch</p>
          <h2 className="content-heading">Tell us where you want to go. We'll sort the rest.</h2>
          <p className="content-body">
            Have a trip in mind, or just want to talk through ideas? Send us a note and one of
            our trip planners will get back to you within a day.
          </p>
          <dl className="contact-details">
            <div>
              <dt>Email</dt>
              <dd><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd><a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}>{CONTACT_PHONE}</a></dd>
            </div>
          </dl>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-trip">Where are you thinking of going?</label>
            <input
              id="contact-trip"
              name="trip"
              type="text"
              value={form.trip}
              onChange={handleChange}
              placeholder="Ladakh, Bali, a coastline somewhere…"
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us a bit about the trip you're picturing"
            />
          </div>

          <div className="content-actions">
            <ButtonWithIcon type="submit" variant="primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : status === "sent" ? "Sent — thank you" : "Send message"}
            </ButtonWithIcon>
          </div>
          {status === "sent" && (
            <p className="contact-success">We've got it — we'll be in touch soon.</p>
          )}
        </form>
      </div>
    </section>
  );
}
