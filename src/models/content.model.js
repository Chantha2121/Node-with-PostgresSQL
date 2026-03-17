export const mapContentRow = (row) => ({
  id: row.id,
  title: row.title,
  body: row.body,
  image: row.image,
  imageUrl: row.image ? `/uploads/${row.image}` : null,
  authorId: row.author_id,
  createdAt: row.created_at,
  author: {
    id: row.user_id,
    username: row.username,
    email: row.email,
  },
});
