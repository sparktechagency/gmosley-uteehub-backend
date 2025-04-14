// src/scripts/generator/getTemplates.ts

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const getTemplates = (folderName: string) => {
  const name = capitalize(folderName);

  return {
    [`interface.ts`]: `
import { Document, Types } from "mongoose";

export type I${name} extends Document {
  name: string;
  userId: Types.ObjectId;
};
`,

    [`model.ts`]: `
import { Schema, model } from "mongoose";
import { I${name} } from "./${folderName}.interface";

const ${name}Schema = new Schema<I${name}>({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
}, {
  timestamps: true,
  toJSON: {
      virtuals: true,
  },
});

const ${name}  = model<I${name}>("${name}", ${name}Schema);
export default ${name} ;
`,

    [`services.ts`]: `
import ${name} from "./${folderName}.model";

export const ${name}Service = {
   create${name}: async (data: Partial<I${name}>) => {
    return await ${name}.create(data);
  },

  retrieveAll${name}: async (filter = {}) => {
    const result = await ${name}.find(filter);
    const totalCount = await ${name}.countDocuments();
    return { totalCount, result };
  },

  retrieve${name}ById: async (id: string) => {
    return await ${name}.findById(id);
  },
};
`,

    [`controllers.ts`]: `
import { Request, Response } from "express";
import { ${name}Service } from "./${folderName}.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import asyncHandler from "../../../shared/asyncHandler";
import CustomError from "../../errors";

export const create${name} = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const created = await ${name}Service.create${name}(data);

  if (!created) {
    throw new CustomError.BadRequestError("Failed to create ${folderName}");
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: "success",
    message: "${name} created successfully",
    data: created,
  });
});

export const retrieveAll${name}s = asyncHandler(async (req: Request, res: Response) => {
  const data = await ${name}Service.retrieveAll${name}();
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: "success",
    message: "${name}s retrieved successfully",
    data,
  });
});

export const retrieve${name}ById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await ${name}Service.retrieve${name}ById(id);

  if (!item) {
    throw new CustomError.NotFoundError("${name} not found!");
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: "success",
    message: "${name} retrieved successfully",
    data: item,
  });
});
`,

    [`validation.ts`]: `
import { z } from 'zod';

const create${name}ZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is Required!',
    }),
    userId: z.string({
      required_error: 'userId is Required!',
    }),
  }),
});

const update${name}ZodSchema = create${name}ZodSchema.deepPartial();

const getSpecific${name}ZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: '${name} ID is missing in request params!',
    }),
  }),
});

export const ${name}Validation = {
  create${name}ZodSchema,
  update${name}ZodSchema,
  getSpecific${name}ZodSchema
};
`,

    [`route.ts`]: `
import { Router } from 'express';
import authentication from '../../middlewares/authorization';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ${name}Controller } from './${folderName}.controller';
import { ${name}Validation } from './${folderName}.validation';

const ${folderName}router = Router();

router.post(
    '/create',
    authentication(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(${name}Validation.create${name}ZodSchema),
    ${name}Controller.create${name}
    );
    
router.get(
    '/',
    authentication(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    ${name}Controller.retrieveAll${name}s
);

router.get(
    '/:id',
     authentication(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    ${name}Controller.retrieve${name}ById
);


export default ${folderName}router;
`,
  };
};
