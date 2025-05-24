const express = require("express");
const { db } = require("./firebaseAdmin");

const router = express.Router();

// Obtener todos los eventos
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("events").get();
        let events = [];
        snapshot.forEach((doc) => events.push({ id: doc.id, ...doc.data() }));

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener evento por ID
router.get("/:eventId", async (req, res) => {
    try {
        const { eventId } = req.params;// Obtiene el ID del evento desde los parámetros de la URL
        const eventRef = db.collection("events").doc(eventId);// Referencia al documento en Firestore
        const doc = await eventRef.get();// Obtiene el documento

        // Verifica si el documento existe
        if (!doc.exists) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }

        res.json(doc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/users/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(userDoc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
