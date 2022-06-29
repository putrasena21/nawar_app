module.exports = {
  getPagination: (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  },

  getPaginationData: (page, size, total) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    const totalPage = Math.ceil(total / limit);
    return { limit, offset, totalPage };
  },
};
