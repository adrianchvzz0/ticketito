const express = require("express");
const multer = require("multer"); // Corregir importación de multer
const { db } = require("./firebaseAdmin");
const { bucket } = require("./firebaseAdmin");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Agregar evento
router.post("/", async (req, res) => {
    try {
        const { title, location, palco, date, image, imageSecondary, prices, details, category } = req.body;
        const newEventRef = db.collection("events").doc();

        await newEventRef.set({
            id: newEventRef.id,
            title,
            location,
            palco,
            date,
            image,
            imageSecondary,
            prices,
            details,
            category
        });

        res.status(201).json({ id: newEventRef.id, message: "Evento agregado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Subir imagen
router.post("/upImage", upload.single("image"), async (req, res) => {
    try {
        // Verifica si se ha subido un archivo
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ninguna imagen" });
        }

        // Genera un nombre único para el archivo combinando la fecha actual con el nombre original
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const file = bucket.file(fileName); // Crea una referencia al archivo en el bucket de almacenamiento

        // Crea un flujo de escritura para subir la imagen al almacenamiento
        const stream = file.createWriteStream({
            metadata: { contentType: req.file.mimetype }, // Configura el tipo de contenido del archivo
        });

        // Maneja errores en la subida
        stream.on("error", (err) => {
            console.error(err);
            res.status(500).json({ error: "Error al subir la imagen" });
        });

        // Cuando la subida finaliza, hace el archivo público y devuelve la URL pública
        stream.on("finish", async () => {
            await file.makePublic(); // Hace que la imagen sea accesible públicamente
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            res.status(200).json({ imageUrl: publicUrl }); // Responde con la URL de la imagen subida
        });

        // Escribe los datos de la imagen en el flujo
        stream.end(req.file.buffer);
    } catch (error) {
        // Maneja errores generales y responde con un mensaje de error
        res.status(500).json({ error: error.message });
    }
});

// Actualizar datos de un evento por ID
router.put("/:eventId", async (req, res) => {
    try {
        const { eventId } = req.params; // ID del evento
        const updatedData = req.body;   // Datos a actualizar

        const eventRef = db.collection("events").doc(eventId);
        const doc = await eventRef.get();

        // Verificar si el evento existe
        if (!doc.exists) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }

        // Actualizar los datos del evento
        await eventRef.update(updatedData);

        res.status(200).json({ message: "Evento actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/purchase", async (req, res) => {
    const { userId, userEmail, eventDetails, total, purchaseDate } = req.body;

    if (!userId || !userEmail || !eventDetails || !total || !purchaseDate) {
        return res.status(400).json({ error: "Datos incompletos en la solicitud" });
    }

    const { title, date, zone, quantity } = eventDetails;

    const newPurchaseRef = db.collection("purchases").doc();

    await newPurchaseRef.set({
        userId,
        userEmail,
        eventTitle: title,
        eventDate: date,
        zone,
        ticketQuantity: quantity,
        totalPrice: total,
        purchaseDate
    });

    res.status(201).json({ id: newPurchaseRef.id, message: "Compra realizada con éxito" });
});

module.exports = router;
