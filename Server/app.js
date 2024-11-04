import express from "express";
import { UserLogin, changeUsernameAndPassword } from "./data/Login.js";
import {getPropietarios, registerPersonAndUser, getUsuarioById, updateUsuarioById, deleteUser, UserAvilittar } from "./data/User.js"
import { getTown } from "./data/Town.js";
import { getRedSalud } from "./data/RedSalud.js";
import { getFarmacias, registerFarmacia, getFarmaciasByIdUser, getFarmaciasById, updateFarmacia, deletePharmacy } from "./data/Farmacy.js";
import { getZona } from "./data/Zona.js";
import { getTyPharmacy } from "./data/TypePharmacy.js";
import { getSector } from "./data/Sector.js";

import cors from 'cors'
const corsOptions = {
    origin: 'http://192.168.100.14:8080',
    methods: ["Post","GET"],
    credential: true
}

const app = express();
app.use(express.json());
app.use(cors(corsOptions))


//-------------------------------------------------------------------------------------------------------------------------------------
// Endpoint para obtener usuarios con rol "Propietario"
app.get("/getPropietarios", async (req, res) => {
  try {
    const users = await getPropietarios();
    if (users.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios con rol "Propietario".' });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios propietarios:', error.message);
    res.status(500).json({ message: 'Error al recuperar usuarios propietarios. Por favor, inténtelo más tarde.' });
  }
});

// Endpoint para registrar una nueva persona y usuario
app.post('/registerUser', async (req, res) => {
  const { name, lastName, numberPhone, nit, email } = req.body;

  // Validar los datos recibidos
  if (!name || !lastName || !numberPhone || !nit || !email) {
      return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  try {
      // // Datos de la persona
       const personData = { name, lastName, numberPhone, nit, email };
       console.log(personData)
       // Llamar a la función de registro
       const response = await registerPersonAndUser(personData)
       // Responder con éxito e incluir la contraseña generada en la respuesta
       res.status(201).json({
           message: 'Registro exitoso',
            // Opcional: puedes incluir la contraseña generada en la respuesta
       });
  } catch (error) {
      console.error('Error al registrar:', error.message);
      res.status(500).json({ message: 'Error al registrar persona y usuario. Por favor, inténtelo más tarde.' });
  }
});

app.get("/getUserById/:id", async (req, res) => {  // Cambiado a req.params
  try {
    const { id } = req.params;  // Obtiene el ID desde los parámetros de la URL
    const user = await getUsuarioById(id);

    if (!user) {
      return res.status(404).json({ message: 'No se encontró al usuario.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener al usuario:', error.message);
    res.status(500).json({ message: 'Error al obtener al usuario.' });
  }
});


app.put('/updateUser/:id', async (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  try {
      const result = await updateUsuarioById(id, userData);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


app.delete('/deleteUser/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await deleteUser(id);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


app.delete('/avilitarUser/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await UserAvilittar(id);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


//-----------------------------------------------------------------------------------------------------------------------------------
//para el Login User
app.post("/UserLogin", async (req, res) => {
    try {
      const { username, password } = req.body
      const result = await UserLogin(username, password)
      if (result.user) {
        res.status(200).send({ message: result.message, user: result.user })
      } else {
        res.status(401).send({ error: result.error })
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error.message);
      res.status(500).send({ error: "Error en el servidor" });
    }
});


app.post("/changeCredentials", async (req, res) => {
  try {
    const { id, userName, password } = req.body;
    if (!id || !userName || !password) {
      return res.status(400).send({ error: "Todos los campos son obligatorios" });
    }

    const result = await changeUsernameAndPassword(id, userName, password);

    if (result.success) {
      res.status(200).send({ message: "Nombre de usuario y contraseña actualizados correctamente" });
    } else {
      res.status(404).send({ error: result.error || "Usuario no encontrado" });
    }
   
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send({ error: "Error en el servidor" });
  }
});











//--------Para las Farmacias--------------------------------------------------------------------------------------------
app.get("/getFarmacy", async (req, res) => {
  try{
    const result = await getFarmacias()
    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios con rol "Propietario".' });
    }
    res.status(200).json(result);
  }catch(error){
    console.log(error.message)
  }
})



app.post("/getFarmacyByUser", async (req, res) => {
  try {
    const { id, role } = req.body;
    const data = req.body

    console.log("data",data)

    const result = await getFarmaciasByIdUser(id, role);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron farmacias de este Propietario' });
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});




app.post('/getFarmaciasById/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await getFarmaciasById(id);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});




app.post('/registerFarmacia', async (req, res) => {
  try {
      const result = await registerFarmacia(req.body);
      res.status(201).json({message: 'Registro exitoso'});
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


app.put('/updatePharmacy', async (req, res) => {
  const pharmacyData = req.body;
  try {
      const result = await updateFarmacia(pharmacyData);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.delete('/deletePharmacy/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await deletePharmacy(id);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});





//------------Para las ciudades
app.get("/getTow", async (req, res) => {
  try {
    const town = await getTown();
    if (town.length === 0) {
      return res.status(404).json({ message: 'No se encontraron ciudades".' });
    }
    res.status(200).json(town);
  } catch (error) {
    console.error('Error al obtener ciudades:', error.message);
    res.status(500).json({ message: 'Error al recuperar redes de salud. Por favor, inténtelo más tarde.' });
  }
});

//------------Para las ciudades
app.get("/getRedSalud", async (req, res) => {
  try {
    const town = await getRedSalud();
    if (town.length === 0) {
      return res.status(404).json({ message: 'No se encontraron redes de Salud".' });
    }
    res.status(200).json(town);
  } catch (error) {
    console.error('Error al obtener ciudades:', error.message);
    res.status(500).json({ message: 'Error al recuperar redes de salud. Por favor, inténtelo más tarde.' });
  }
});




//------------Para las Zona
app.get("/getZona", async (req, res) => {
  try {
    const town = await getZona();
    if (town.length === 0) {
      return res.status(404).json({ message: 'No se encontraron Zonas".' });
    }
    res.status(200).json(town);
  } catch (error) {
    console.error('Error al obtener zonas:', error.message);
    res.status(500).json({ message: 'Error al recuperar zonas. Por favor, inténtelo más tarde.' });
  }
});



//------------Para las Typos de Farmacias
app.get("/getTypeFarmacy", async (req, res) => {
  try {
    const town = await getTyPharmacy();
    if (town.length === 0) {
      return res.status(404).json({ message: 'No se encontraron typos de farmacias".' });
    }
    res.status(200).json(town);
  } catch (error) {
    console.error('Error al obtener zonas:', error.message);
    res.status(500).json({ message: 'Error al recuperar tipos de Farmacias. Por favor, inténtelo más tarde.' });
  }
});


//------------Para el Sector
app.get("/getSector", async (req, res) => {
  try {
    const town = await getSector();
    if (town.length === 0) {
      return res.status(404).json({ message: 'No se encontraron Sectores".' });
    }
    res.status(200).json(town);
  } catch (error) {
    console.error('Error al obtener zonas:', error.message);
    res.status(500).json({ message: 'Error al recuperar sectore. Por favor, inténtelo más tarde.' });
  }
});





app.listen(8080, () => {
  console.log("Server runing ");
});


