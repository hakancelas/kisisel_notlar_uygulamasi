$(document).ready(function () {
  // Sayfa yüklendiğinde notları listele
  loadNotes();

  // Not ekleme formunu işleme
  $('#note-form').submit(function (event) {
    event.preventDefault();  // Formun sayfayı yenilemesini engelle

    const noteText = $('#note').val();  // Textarea'dan not metnini al

    if (noteText) {  // Eğer not metni varsa
      // Not eklemek için AJAX isteği gönder
      $.ajax({
        url: '/add-note',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ text: noteText }),  // JSON formatında veri gönder
        success: function (data) {
          loadNotes();  // Notlar güncellendikten sonra notları yükle
          $('#note').val('');  // Textarea'yı temizle
        },
        error: function (err) {
          alert('Bir hata oluştu');  // Hata olursa kullanıcıya hata mesajı göster
        }
      });
    }
  });

  // Notları yükleme fonksiyonu
  function loadNotes() {
    $.get('/notes', function (data) {  // Sunucudan notları al
      const notesList = $('#notes-list');  // Notların listeleneceği HTML elemanı
      notesList.empty();  // Mevcut listeyi temizle
      data.forEach(function (note) {  // Her bir notu listele
        // Listeye notu ekle
        notesList.append(`<li class="list-group-item">
          ${note.text}  <!-- Not metnini ekle -->
          <button class="btn btn-danger btn-sm float-right" onclick="deleteNote('${note._id}')">Sil</button> <!-- Silme butonu -->
        </li>`);
      });
    });
  }

  // Not silme fonksiyonu
  window.deleteNote = function (id) {
    $.ajax({
      url: `/delete-note/${id}`,  // Silmek için API isteği gönder
      type: 'DELETE',
      success: function (data) {
        loadNotes();  // Silme işlemi başarılı olursa notları güncelle
      },
      error: function (err) {
        alert('Bir hata oluştu');  // Hata durumunda kullanıcıya mesaj göster
      }
    });
  }
});