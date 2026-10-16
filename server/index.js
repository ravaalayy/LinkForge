// Handler untuk redirect short link
app.get('/:code', (req, res) => {
  const { code } = req.params;

  db.get('SELECT * FROM links WHERE code = ?', [code], (err, link) => {
    if (err || !link) {
      return res.status(404).send('Link tidak ditemukan');
    }

    // Tambah hitungan klik
    db.run('UPDATE links SET clicks = clicks + 1 WHERE code = ?', [code]);

    // Tambahkan protokol jika pengguna hanya memasukkan domain
    let targetUrl = link.original_url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    return res.redirect(targetUrl);
  });
});