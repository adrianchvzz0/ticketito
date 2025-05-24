require('dotenv').config();
const admin = require("firebase-admin");
const multer = require("multer");
//Inicializa firebase con el storage

const serviceAccount = require(process.env.FIREBASE_ADMIN_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Middleware
app.use(cors());
app.use(express.json());

//Configurar multer para recibir archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Registro de usuario
app.post("/users", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Crear usuario en Firebase Authentication
        const user = await admin.auth().createUser({ email, password });

        // Guardar info extra en Firestore
        await db.collection("users").doc(user.uid).set({
            email,
            createdAt: new Date(),
        });

        res.status(201).json({ uid: user.uid, message: "Usuario creado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Inicio de sesión con correo y contraseña
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);
        const token = await userCredential.user.getIdToken();

        res.status(200).json({ token, user: userCredential.user });
    } catch (error) {
        res.status(401).json({ error: "Credenciales incorrectas" });
    }
});

// Inicio de sesión con Google
app.post("/login/google", async (req, res) => {
    try {
        const { idToken } = req.body;

        const credential = admin.auth.GoogleAuthProvider.credential(idToken);
        const result = await admin.auth().signInWithCredential(credential);
        const token = await result.user.getIdToken();

        res.json({ token, user: result.user });
    } catch (error) {
        res.status(401).json({ error: "Error con Google" });
    }
});

// ✅ Obtener usuario por UID
app.get("/users/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const userRef = db.collection("users").doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.status(200).json(doc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agrega un nuevo evento
app.post("/addEvent", async (req, res) => {
    try {
        const { title, palco, location, date, price, priceVIP, priceGeneral, pricePreferente, image, imageSecondary, details } = req.body;

        const newEventRef = db.collection("events").doc();
        await newEventRef.set({
            id: newEventRef.id,
            title,
            palco,
            location,
            date,
            price,
            priceVIP,
            priceGeneral,
            pricePreferente,
            image,
            imageSecondary,
            details,
        });

        res.status(201).json({ id: newEventRef.id, message: "Evento agregado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtiene los eventos
app.get("/events", async (req, res) => {
    try {
        const snapshot = await db.collection("events").get();
        let events = [];
        snapshot.forEach((doc) => events.push({ id: doc.id, ...doc.data() }));
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Obtiene un evento por ID
app.get("/events/:eventId", async (req, res) => {
    try {
        const { eventId } = req.params;
        const eventRef = db.collection("events").doc(eventId);
        const doc = await eventRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }

        res.json(doc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* 
---------------------------
🔹 SUBIR IMÁGENES A FIREBASE STORAGE 
---------------------------
*/

app.post("/uploadImage", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ninguna imagen" });
        }

        const fileName = `${Date.now()}-${req.file.originalname}`;
        const file = bucket.file(fileName);

        const stream = file.createWriteStream({
            metadata: { contentType: req.file.mimetype },
        });

        stream.on("error", (err) => {
            console.error(err);
            res.status(500).json({ error: "Error al subir la imagen" });
        });

        stream.on("finish", async () => {
            await file.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            res.status(200).json({ imageUrl: publicUrl });
        });

        stream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* 
---------------------------
🔹 MANEJO DE ERRORES Y SERVIDOR 
---------------------------
*/

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Algo salió mal en el servidor" });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
