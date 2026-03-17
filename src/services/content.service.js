import { query } from '../../config/db.js';

export const createContent = async ({ title, body, authorId, image }) => {
  const result = await query(
    `
      INSERT INTO content (title, body, author_id, image)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, body, image, author_id, created_at
    `,
    [title, body, authorId, image]
  );

  return result.rows[0];
};

export const listAllContent = async () => {
  const result = await query(
    `
      SELECT
        c.id,
        c.title,
        c.body,
        c.image,
        c.author_id,
        c.created_at,
        u.id AS user_id,
        u.username,
        u.email
      FROM content c
      JOIN users u ON u.id = c.author_id
      ORDER BY c.created_at DESC
    `
  );

  return result.rows;
};
