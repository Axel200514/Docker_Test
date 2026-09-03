const { connectToDatabase, client } = require('../config/database');
const { ObjectId } = require('mongodb');

const realizarVenta = async (req, res) => {
    const session = client.startSession();

    try {
        session.startTransaction();

        const db = await connectToDatabase();
        const { productoId, cantidad } = req.body;

        if (!ObjectId.isValid(productoId) || !cantidad || cantidad <= 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: 'Datos de venta invalidos' });
        }

        const producto = await db
            .collection('productos')
            .findOne(
                { _id: new ObjectId(productoId) },
                { session }
            );

        if (!producto) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (producto.stock < cantidad) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                error: `Stock insuficiente. Disponible: ${producto.stock}`
            });
        }

        await db
            .collection('productos')
            .updateOne(
                { _id: new ObjectId(productoId) },
                { $inc: { stock: -cantidad } },
                { session }
            );

        const nuevaVenta = {
            productoId: new ObjectId(productoId),
            nombreProducto: producto.nombre,
            cantidadVendida: cantidad,
            precioUnitario: producto.precio,
            total: producto.precio * cantidad,
            fecha: new Date()
        };

        const resultadoVenta = await db
            .collection('ventas')
            .insertOne(nuevaVenta, { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            mensaje: 'Venta registrada con exito',
            ventaId: resultadoVenta.insertedId
        });

    } catch (error) {
        try {
            await session.abortTransaction();
        } catch (abortError) {
            console.error(abortError);
        }

        session.endSession();
        console.error(error);

        return res.status(500).json({
            error: 'Error al procesar la venta'
        });
    }
};

const getVentas = async (req, res) => {
    try {
        const db = await connectToDatabase();
        const ventas = await db.collection('ventas').find().toArray();
        res.json(ventas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    realizarVenta,
    getVentas
};
