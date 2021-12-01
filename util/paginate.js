const paginate = async (
    model,
    pageSize,
    pageLimit,
    search = {},
    order = [],
    include
) => {
    try {
        const limit = parseInt(pageLimit, 10) || 10;
        const page = parseInt(pageSize, 10) || 1;

        // create an options object
        let options = {};

        options["offset"] = getOffset(page, limit);
        options["limit"] = limit;

        // check if the search object is empty
        if (JSON.stringify(search) === "{}") {
            options["where"] = search;
        }

        // check if the order array is empty
        if (order && order.length) {
            options["order"] = order;
        }

        // check if the relation object is empty
        if (include.length > 0) {
            options["include"] = include;
        }

        // take in the model, take in the options
        let { count, rows } = await model.findAndCountAll(options);

        return {
            previousPage: getPreviousPage(page),
            currentPage: page,
            nextPage: getNextPage(page, limit, count),
            total: count,
            limit: limit,
            data: rows,
        };
    } catch (error) {
        return error;
    }
};

const paginateActiveApprovalList = async (
    model,
    pageSize,
    pageLimit,
    search,
    order = [],
    include
) => {
    try {
        const limit = parseInt(pageLimit, 10) || 10;
        const page = parseInt(pageSize, 10) || 1;

        // create an options object
        let options = {};

        options["offset"] = getOffset(page, limit);
        options["limit"] = limit;

        // // check if the search object is empty
        // if (JSON.stringify(search) === "{}") {
        options["where"] = search;
        // }

        // check if the order array is empty
        if (order && order.length) {
            options["order"] = order;
        }

        // check if the relation object is empty
        if (include.length > 0) {
            options["include"] = include;
        }
        console.log(options)
        // take in the model, take in the options
        let { count, rows } = await model.findAndCountAll(options);

        return {
            previousPage: getPreviousPage(page),
            currentPage: page,
            nextPage: getNextPage(page, limit, count),
            total: count,
            limit: limit,
            data: rows,
        };
    } catch (error) {
        return error;
    }
};

const getOffset = (page, limit) => {
    return page * limit - limit;
};

const getNextPage = (page, limit, total) => {
    if (total / limit > page) {
        return page + 1;
    }

    return null;
};

const getPreviousPage = (page) => {
    if (page <= 1) {
        return null;
    }
    return page - 1;
};

module.exports = {
    paginate,
    paginateActiveApprovalList
};
