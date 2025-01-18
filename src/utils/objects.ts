export const authorSelect = {
  include: {
    author: {
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  },
}