const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const app = express();
const PORT = 3000;

const filePath = path.join(__dirname, 'responses.json');

app.use(express.json());

// ✅ جلب رد عشوائي من فئة
app.get('/api/respond/:category', (req, res) => {
  const data = fs.readJsonSync(filePath);
  const category = req.params.category;

  if (!data[category]) return res.status(404).json({ error: "الفئة غير موجودة"});

  const responses = data[category];
  const random = responses[Math.floor(Math.random() * responses.length)];
  res.json({ response: random});
});

// ✅ إضافة رد جديد لفئة
app.post('/api/teach', (req, res) => {
  const { category, text} = req.body;
  if (!category ||!text) return res.status(400).json({ error: "المدخلات ناقصة"});

  const data = fs.readJsonSync(filePath);
  if (!data[category]) data[category] = [];

  data[category].push(text);
  fs.writeJsonSync(filePath, data, { spaces: 2});

  res.json({ message: "تمت الإضافة بنجاح", added: text});
});

app.listen(PORT, () => console.log(`🚀 API شغالة على http://localhost:${PORT}`));
