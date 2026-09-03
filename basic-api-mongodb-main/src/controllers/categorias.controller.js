const { connectToDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');

const new_categorias = [
    { nombre: 'Electrónica', descripcion: 'Artículos electrónicos' },
    { nombre: 'Hogar', descripcion: 'Artículos para el hogar' }
];

const cnew_bulk = async (req, res) => {
    try {
        const db = await connectToDatabase();
        
        
        let categoriasAInsertar = req.body;

        if (Array.isArray(categoriasAInsertar) && categoriasAInsertar.length > 0) {
            
        } else if (categoriasAInsertar && typeof categoriasAInsertar === 'object' && Object.keys(categoriasAInsertar).length > 0) {
            
            categoriasAInsertar = [categoriasAInsertar];
        } else {
            
            categoriasAInsertar = new_categorias;
        }

        const result = await 
            db.collection('categorias').insertMany(categoriasAInsertar);
            
        res.status(201).json({ 
            message: 'Categorias created (cnew_bulk)', 
            cantidad: categoriasAInsertar.length,
            ids: result.insertedIds 
        });

    } catch (error) {
        console.error('Error creating categorias with cnew_bulk:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getCategorias = async (req, res) => {
    try {
        //ESPERAMOS CONECTARNOS A MONGODB Y OBTENER LA BASE DE DATOS
        const db = await connectToDatabase();

        const categorias = await 
        //SINTAXIS PARA OBTENER TODAS LAS CATEGORIAS DE LA COLECCIÓN "categorias"
        db.collection('categorias').find().toArray();
        //RETORNAMOS LAS CATEGORIAS EN FORMATO JSON(JS)
        res.json(categorias);

    } catch (error) {
        console.error('Error fetching categorias:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getCategoriaById = async (req, res) => {
    try{

        const db = await connectToDatabase();
        const { id } = req.params;

        //SINTAXIS PARA OBTENER UNA CATEGORIA POR SU ID(MONGO)
        const categoria = await 
            db.collection('categorias').findOne({ _id: new ObjectId(id) });

        //RETORNAMOS LA CATEGORIA EN FORMATO JSON(JS)
        if (!categoria) return res.status(404).json({ error: 'Categoria not found' });
        res.json(categoria);

    } catch (error) {
        console.error('Error fetching categoria by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const createCategoria = async (req, res) => {
    try {
        const db = await connectToDatabase();
        const newCategoria = req.body; //{nombre: 'Categoria 1', descripcion: 'Descripcion 1' }

        //SINTAXIS PARA INSERTAR UNA NUEVA CATEGORIA EN LA COLECCIÓN "categorias"(Mongo)
        const result = await 
        db.collection('categorias').insertOne(newCategoria);

        //RETORNAMOS UN MENSAJE DE ÉXITO Y EL ID DE LA NUEVA CATEGORIA CREADA
        res.status(201).json({ message: 'Categoria created', id: result.insertedId });
    }catch (error) {
        console.error('Error creating categoria:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const createCategorias = async (req, res) => {
    try{
        const db = await connectToDatabase();
        const newCategorias = req.body; //[{nombre: 'Categoria 1', descripcion: '...' }, {nombre: 'Categoria 2', descripcion: '...' }]

        if (!Array.isArray(newCategorias) || newCategorias.length === 0) {
            return res.status(400).json({ error: 'Invalid input. Expected an array of categorias.' });
        }

        //SINTAXIS PARA INSERTAR VARIAS CATEGORIAS EN LA COLECCIÓN "categorias"(Mongo)
        const result = await 
            db.collection('categorias').insertMany(newCategorias);
        res.status(201).json({ message: 'Categorias created', ids: result.insertedIds });

    }catch (error) {
        console.error('Error creating categorias:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateCategoria = async (req, res) => {
    try{
        const db = await connectToDatabase();
        const { id } = req.params;
        
        //SINTAXIS PARA ACTUALIZAR UNA CATEGORIA POR SU ID(MONGO)
        const result = await 
            db.collection('categorias').updateOne(
                { _id: new ObjectId(id) },
                { $set: req.body }
            );
        
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Categoria not found' });
        
        res.json({ message: 'Categoria updated' });

    }catch (error) {
        console.error('Error updating categoria:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteCategoria = async (req, res) => {
    try{
        const db = await connectToDatabase();
        const { id } = req.params;
        
        //SINTAXIS PARA ELIMINAR UNA CATEGORIA POR SU ID(MONGO)
        const result = await 
            db.collection('categorias').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) return res.status(404).json({ error: 'Categoria not found' });

        res.json({ message: 'Categoria deleted' });

    }catch (error) {
        console.error('Error deleting categoria:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { 
    getCategorias, 
    getCategoriaById, 
    createCategoria, 
    createCategorias, 
    updateCategoria, 
    deleteCategoria,
    cnew_bulk,
    new_bulk: cnew_bulk
};