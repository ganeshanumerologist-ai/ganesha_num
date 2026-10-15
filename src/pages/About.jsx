import React from "react";
import { NUMBER_MEANINGS } from "../data/meanings.js";

export default function About() {
  return (
    <div>
      <h1 className="text-gradient">About Numerology</h1>
      <p style={{ marginTop: 8, maxWidth: 800 }}>
        Numerology is the study of the mystical relationship between numbers and living things.
        It is rooted in ancient civilizations — from Pythagoras in Greece to the Vedic traditions of India.
        Every number carries a unique vibration and meaning that can reveal insights about character,
        destiny and life purpose.
      </p>

      <section style={{ marginTop: 30 }}>
        <h2>How It Works</h2>
        <div className="grid grid-2">
          {[
            ["Life Path", "Derived from your date of birth. It represents your life's journey and the lessons you are here to learn."],
            ["Destiny Number", "Calculated from the full name at birth. It reveals your natural talents and what you are destined to become."],
            ["Soul Urge", "Formed from the vowels of your name. It reflects your inner desires and what truly motivates you."],
            ["Personality", "Formed from the consonants of your name. It shows how others perceive you at first meeting."],
          ].map(([t, d]) => (
            <div key={t} className="card">
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>Master Numbers</h2>
        <p>Numbers 11, 22 and 33 are considered Master Numbers with heightened spiritual significance and are not reduced further.</p>
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          {[11, 22, 33].map((n) => {
            const m = NUMBER_MEANINGS[n];
            return (
              <div key={n} className="card number-card">
                <div className="num"><span>{n}</span></div>
                <h3>{m.title}</h3>
                <p style={{ fontSize: ".85rem" }}>{m.keywords}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
