const express = require('express');
const app = express();
const port = 1981; // ini adalah port default untuk menjalankan app.js nya

app.use(express.json());
app.use(express.static('public'));

// let vehicles = [];
// let vehicleIdCounter = 1;

// Dummy data: pre-populasi kendaraan dengan beberapa data contoh
let vehicles = [
    {
      id: 1,
      ownerId: "001",
      registrationNumber: "B1234XYZ",
      vehicleType: "Sedan",
      manufactureYear: 2010,
      dateRegistered: new Date(),
      transactions: []  // Tempat menyimpan transaksi pembayaran
    },
    {
      id: 2,
      ownerId: "002",
      registrationNumber: "B5678ABC",
      vehicleType: "SUV",
      manufactureYear: 2015,
      dateRegistered: new Date(),
      transactions: []
    }
  ];
  let vehicleIdCounter = 3; // Karena sudah ada dummy dengan id 1 dan 2

// Endpoint untuk registrasi kendaraan
app.post('/api/vehicles/register', (req, res) => {
    const { ownerId, registrationNumber, vehicleType, manufactureYear } = req.body;
    
    if (!ownerId || !registrationNumber || !vehicleType || !manufactureYear) {
      return res.status(400).json({ error: 'Semua field wajib diisi.' });
    }
    
    const newVehicle = {
      id: vehicleIdCounter++,
      ownerId,
      registrationNumber,
      vehicleType,
      manufactureYear,
      dateRegistered: new Date(),
      transactions: []
    };
    
    vehicles.push(newVehicle);
    
    res.status(201).json({ message: 'Kendaraan berhasil didaftarkan', vehicle: newVehicle });
  });
  
  // Endpoint untuk menghitung pajak kendaraan
  app.get('/api/vehicles/:vehicleId/calculate-tax', (req, res) => {
    const { vehicleId } = req.params;
    const vehicle = vehicles.find(v => v.id == vehicleId);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Kendaraan tidak ditemukan.' });
    }
    
    const baseTax = 200000;
    const currentYear = new Date().getFullYear();
    const age = currentYear - vehicle.manufactureYear;
    let surcharge = 0;
    
    if (age > 10) {
      surcharge = 50000;
    }
    
    const totalTax = baseTax + surcharge;
    
    res.json({
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      baseTax,
      surcharge,
      totalTax
    });
  });
  
  // Endpoint untuk memproses pembayaran pajak (simulasi transaksi)
  app.post('/api/vehicles/:vehicleId/paytax', (req, res) => {
    const { vehicleId } = req.params;
    const vehicle = vehicles.find(v => v.id == vehicleId);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Kendaraan tidak ditemukan.' });
    }
    
    const baseTax = 200000;
    const currentYear = new Date().getFullYear();
    const age = currentYear - vehicle.manufactureYear;
    let surcharge = 0;
    if (age > 10) {
      surcharge = 50000;
    }
    const totalTax = baseTax + surcharge;
    
    // Simulasi proses pembayaran:
    const { paymentMethod } = req.body;
    const transaction = {
      transactionId: 'TRX-' + Math.floor(Math.random() * 100000),
      vehicleId: vehicle.id,
      paymentMethod: paymentMethod || 'Debit/Credit Card',
      amount: totalTax,
      paymentDate: new Date()
    };
    
    vehicle.transactions.push(transaction);
    
    res.json({
      message: 'Pembayaran pajak berhasil diproses',
      transaction
    });
  });
  
  // Endpoint untuk mengambil daftar kendaraan (beserta transaksi pembayaran mereka)
  app.get('/api/vehicles', (req, res) => {
    res.json({ vehicles });
  });
  
  // Menjalankan server
  app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`);
  });