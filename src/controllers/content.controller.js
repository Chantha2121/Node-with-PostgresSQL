import { mapContentRow } from '../models/content.model.js';
import { createContent, listAllContent } from '../services/content.service.js';

export const uploadContent = async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        status: 'error',
        message: 'title and body are required.',
      });
    }

    const created = await createContent({
      title,
      body,
      authorId: req.user.id,
      image: req.file ? req.file.filename : null,
    });

    return res.status(201).json({
      status: 'ok',
      data: {
        id: created.id,
        title: created.title,
        body: created.body,
        image: created.image,
        imageUrl: created.image ? `/uploads/${created.image}` : null,
        authorId: created.author_id,
        createdAt: created.created_at,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getAllContent = async (req, res) => {
  try {
    const rows = await listAllContent();
    const data = rows.map(mapContentRow);

    return res.status(200).json({
      status: 'ok',
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
