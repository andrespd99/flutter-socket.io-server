const {
    io
} = require('../index');
const Band = require('../models/band');

const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Los Mesoneros'));
bands.addBand(new Band('Viniloversus'));

// Socket messages
io.on('connection', client => {
    console.log('Client connected...');

    client.emit('active-bands', bands.getBands());

    client.on("message", (payload) => {
        console.log('Message', payload)

        io.emit('message', {
            admin: "Nuevo mensaje"
        });
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);

        bands.addBand(newBand);

        io.emit('active-bands', bands.getBands());
    });

    client.on('disconnect', () => {
        console.log('Client disconnected!');
    });
    // client.on('emit-message', (payload) => client.broadcast.emit('new-message', payload));

});