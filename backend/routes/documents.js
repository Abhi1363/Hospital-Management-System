const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');
const Document = require('../models/Document');

const router = express.Router();


const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

router.get('/', auth, async (req, res) => {
  try {
    const { patient, page = 1, limit = 10 } = req.query;
    const query = patient ? { patient } : {};
    
    const documents = await Document.find(query)
      .populate('patient', 'name')
      .populate('uploadedBy', 'name role')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await Document.countDocuments(query);
    
    res.json({
      documents,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { patient, title, description, category } = req.body;

    if (!patient || !title) {
    
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Patient and title are required' });
    }

    const document = new Document({
      patient,
      uploadedBy: req.user._id,
      title,
      description: description || '',
      category: category || 'Other',
      fileType: req.file.mimetype,
      filePath: req.file.path,
      fileSize: req.file.size
    });

    await document.save();
    
    const populatedDocument = await Document.findById(document._id)
      .populate('patient', 'name')
      .populate('uploadedBy', 'name role');

    res.status(201).json({ message: 'Document uploaded successfully', document: populatedDocument });
  } catch (error) {
   
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/:id/download', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(document.filePath);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.patch('/:id/verify', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can verify documents' });
    }

    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    )
    .populate('patient', 'name')
    .populate('uploadedBy', 'name role');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document verified successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    
    if (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;