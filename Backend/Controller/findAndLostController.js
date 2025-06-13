import Lost from "../Models/lostSchema.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Setup upload directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ CREATE Lost Item
export const lost = async (req, res) => {
  try {
    console.log('Request files:', req.files);
    console.log('Request body:', req.body);

    const {
      name, email, productName, brand, color,
      serialNumber, location, date, category,
      description, type
    } = req.body;

    if (!name || !email || !productName || !brand || !color ||
        !location || !date || !category || !description || !type) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled"
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const images = [];
    if (req.files?.length > 0) {
      req.files.forEach(file => images.push(file.filename));
    } else {
      return res.status(400).json({
        success: false,
        message: "At least one image is required"
      });
    }

    const lostItem = await Lost.create({
      name,
      email,
      productName,
      brand,
      color,
      serialNumber: serialNumber || '',
      location,
      date,
      category,
      description,
      type,
      user: userId,
      images
    });

    res.status(201).json({
      success: true,
      message: "Item reported successfully",
      data: lostItem
    });

  } catch (error) {
    console.error("Error in lost controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// ✅ READ all items (Admin or global display)
export const getLostItems = async (req, res) => {
  try {
    const items = await Lost.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ READ items by logged-in user
export const getLostItemsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const items = await Lost.find({ user: userId }).sort({ createdAt: -1 });
    if (!items.length) {
      return res.status(404).json({ message: 'No items found for this user' });
    }
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ UPDATE Lost Item (only by owner)
export const updateLostItem = async (req, res) => {
  try {
    const item = await Lost.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updated = await Lost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ DELETE Lost Item (only by owner)
export const deleteLostItem = async (req, res) => {
  try {
    const item = await Lost.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Optionally delete images from server
    item.images.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getLostItemById = async (req, res) => {
  try {
    const item = await Lost.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (err) {
    console.error('Error fetching item by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};