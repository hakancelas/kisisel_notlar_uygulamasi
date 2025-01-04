// Gerekli modülleri dahil etme
const express = require('express');  // Express.js modülünü dahil et
const mongoose = require('mongoose');  // MongoDB ile bağlantı için mongoose modülünü dahil et
const bodyParser = require('body-parser');  // JSON verisi işlemek için body-parser modülü

const app = express();  // Express uygulamasını başlat
const PORT = 3000;  // Sunucu portu

// Middleware: JSON formatındaki verileri işleyebilmek için bodyParser kullanılıyor
app.use(bodyParser.json());

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost/personal_notes', {
  useNewUrlParser: true,  // Eski sürüm bağlantıları için yeni parser kullan
  useUnifiedTopology: true,  // Yeni Topology kullanımı
})
.then(() => console.log("MongoDB'ye bağlandı"))  // Bağlantı başarılıysa konsola yazdır
.catch(err => console.log(err));  // Hata alırsak hata mesajını yazdır

// MongoDB'deki notlar için model oluşturma
const Note = mongoose.model('Note', new mongoose.Schema({
  text: { type: String, required: true }  // Not metnini bir String olarak tutuyoruz
}));

// Yeni not eklemek için API endpoint'i
app.post('/add-note', async (req, res) => {
  const note = new Note({ text: req.body.text });  // Formdan gelen metni not olarak al

  try {
    await note.save();  // Yeni notu MongoDB'ye kaydet
    res.status(201).json({ message: 'Not başarıyla eklendi' });  // Başarıyla kaydedildiyse mesaj gönder
  } catch (err) {
    res.status(400).json({ error: 'Bir hata oluştu' });  // Hata olursa hata mesajı gönder
  }
});

// Tüm notları listelemek için API endpoint'i
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();  // MongoDB'den tüm notları al
    res.json(notes);  // Notları JSON formatında geri gönder
  } catch (err) {
    res.status(400).json({ error: 'Notlar getirilemedi' });  // Hata olursa hata mesajı gönder
  }
});

// Not silmek için API endpoint'i
app.delete('/delete-note/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);  // ID'ye göre notu sil
    res.json({ message: 'Not başarıyla silindi' });  // Başarı mesajı gönder
  } catch (err) {
    res.status(400).json({ error: 'Not silinemedi' });  // Hata olursa hata mesajı gönder
  }
});

// Sunucu başlatma
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);  // Sunucu çalıştığında konsola yazdır
});