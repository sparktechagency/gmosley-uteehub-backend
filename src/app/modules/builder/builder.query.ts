import { Query, SortOrder } from "mongoose";

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;
    public excludeFields: string[];

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>, excludeFields: string[] = []) {
        this.modelQuery = modelQuery;
        this.query = query;
        this.excludeFields = excludeFields;
    }

    search = (searchFields: string[]) => {
        const searchTerm = this.query.search as string;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    };

    filter = () => {
        const filterQuery = { ...this.query };
        const excludeFields = ['search', 'limit', 'page', 'sortBy', 'sortOrder', 'fields', 'populate', ...this.excludeFields];
        excludeFields.forEach((field) => delete filterQuery[field]);
        this.modelQuery = this.modelQuery.find(filterQuery);
        return this;
    };

    pagination = () => {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    };

    sort = () => {
        const sortBy = this.query.sortBy as string || 'createdAt';
        const rawOrder = (this.query.sortOrder as string || 'desc').toLowerCase();
        const sortOrder = ['asc', 'desc'].includes(rawOrder) ? rawOrder : 'desc';
        this.modelQuery = this.modelQuery.sort({ [sortBy]: sortOrder as SortOrder });
        return this;
    };

    select = (defaultExcludeFields = '-__v') => {
        const fields = this.query.fields as string || defaultExcludeFields;
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    };

    populate = () => {
        const populateStr = this.query.populate as string;
        if (populateStr) {
            const fields = populateStr.split(',').map(p => p.trim());
            fields.forEach(field => {
                this.modelQuery = this.modelQuery.populate(field);
            });
        }
        return this;
    };

    countTotal = async () => {
        const totalQueries = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(totalQueries);
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const totalPages = Math.ceil(total / limit);

        return { page, limit, total, totalPages };
    };
}

export default QueryBuilder;
