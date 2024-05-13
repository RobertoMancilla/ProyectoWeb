const router = require("express").Router();
const Users = require("../data/schema_users");
const bcrypt = require("bcrypt");

const { verifyAuthToken } = require('../middleware/tokens');

// Get info of the user
router.get('/info', verifyAuthToken, async (req, res) => {
    try {
        const user = await Users.findById(req.id); // asumiendo que req.id se establece en verifyAuthToken
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send({
            email: user.email,
            name: user.name,
            surname: user.surname
        });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Modify user data
// Ruta para actualizar el perfil del usuario
router.put('/update', verifyAuthToken, async (req, res) => {
    const userId = req.id; 
    const { oldPassword, newPassword, name, surname, email } = req.body; // Desestructuración de los datos recibidos

    // Validar que el objeto de actualizaciones no esté vacío
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({ error: 'No update data provided' });
    }

    try {
        // Obtener el usuario de la base de datos
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Comprobar la contraseña antigua si se desea cambiar la contraseña
        if (oldPassword && newPassword) {
            const passwordIsValid = await bcrypt.compareSync(oldPassword, user.password);
            if (!passwordIsValid) {
                return res.status(401).send({ error: 'Incorrect old password' });
            }
            // Si la contraseña antigua es correcta, actualizar a la nueva contraseña cifrada
            user.password = bcrypt.hashSync(newPassword, 10);
        }

        if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return res.status(400).send({ error: 'Invalid email format' });
        }

        // Actualización de campos si están presentes y son diferentes a los actuales
        if (name && name !== user.name) user.name = name;
        if (surname && surname !== user.surname) user.surname = surname;
        if (email && email !== user.email) user.email = email;

        // Guardar el usuario actualizado
        await user.save();

        res.send({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).send({ error: 'Failed to update user profile' });
    }
});

router.delete('/delete', verifyAuthToken, async(req, res) => {
    const userId = req.id;
    try {
        // Verificar y eliminar el usuario en una operación
        const deletedUser = await Users.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.send({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).send({ error: 'Failed to delete user profile' });
    }
});

module.exports = router;