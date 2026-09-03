const { connectToDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');

const new_cajeros = [
    { nombre: 'Juan Perez', turno: 'Mañana', caja: 1 },
    { nombre: 'Maria Lopez', turno: 'Tarde', caja: 2 }
];

const new_bulk = async (req, res) => {
    try {
        const db = await connectToDatabase();
        
        let cajerosAInsertar = req.body;

        if (Array.isArray(cajerosAInsertar) && cajerosAInsertar.length > 0) {
        } else if (cajerosAInsertar && typeof cajerosAInsertar === 'object' && Object.keys(cajerosAInsertar).length > 0) {
            cajerosAInsertar = [cajerosAInsertar];
        } else {
            cajerosAInsertar = new_cajeros;
        }

        const result = await db.collection('cajeros').insertMany(cajerosAInsertar);
            
        res.status(201).json({ 
            message: 'Cajeros created (new_bulk)', 
            cantidad: cajerosAInsertar.length,
            ids: result.insertedIds 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getCajeros = async (req, res) => {
    try {
        const db = await connectToDatabase();
        const cajeros = await db.collection('cajeros').find().toArray();
        res.json(cajeros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCajeroById = async (req, res) => {
    try{
        const db = await connectToDatabase();
        const { id } = req.params;
        const cajero = await db.collection('cajeros').findOne({ _id: new ObjectId(id) });

        if (!cajero) return res.status(404).json({ error: 'Cajero not found' });
        res.json(cajero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const createCajero = async (req, res) => {
    try {
        const db = await connectToDatabase();
        const newCajero = req.body;
        const result = await db.collection('cajeros').insertOne(newCajero);
        res.status(201).json({ message: 'Cajero created', id: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const createCajeros = async (req, res) => {
    try{
        const db = await connectToDatabase();
        const newCajeros = req.body;

        if (!Array.isArray(newCajeros) || newCajeros.length === 0) {
            return res.status(400).json({ error: 'Invalid input.' });
        }

        const result = await db.collection('cajeros').insertMany(newCajeros);
        res.status(201).json({ message: 'Cajeros created', ids: result.insertedIds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateCajero = async (req, res) => {
    try{
        const db = await connectToDatabase();
        const { id } = req.params;
        
        const result = await db.collection('cajeros').updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Cajero not found' });
        res.json({ message: 'Cajero updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteCajero = async (req, res) => {
    try{
        const db = await connectToDatabase();
        const { id } = req.params;
        
        const result = await db.collection('cajeros').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) return res.status(404).json({ error: 'Cajero not found' });
        res.json({ message: 'Cajero deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { 
    getCajeros, 
    getCajeroById, 
    createCajero, 
    createCajeros, 
    updateCajero, 
    deleteCajero,
    new_bulk
};
