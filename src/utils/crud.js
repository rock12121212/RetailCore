import { ApiError } from './apiError.js';

export const findByIdOrThrow = async (Model, id, message = 'Resource not found') => {
  const doc = await Model.findById(id);
  if (!doc) {
    throw new ApiError(404, message);
  }
  return doc;
};

export const ensureOwner = (doc, userId, ownerField = 'owner') => {
  if (!doc?.[ownerField] || doc[ownerField].toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not allowed to perform this action');
  }
};

export const updateOwnedById = async (
  Model,
  id,
  updates,
  userId,
  { notFoundMessage = 'Resource not found', ownerField = 'owner' } = {}
) => {
  const doc = await findByIdOrThrow(Model, id, notFoundMessage);
  ensureOwner(doc, userId, ownerField);

  return Model.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
};

export const deleteOwnedById = async (
  Model,
  id,
  userId,
  { notFoundMessage = 'Resource not found', ownerField = 'owner' } = {}
) => {
  const doc = await findByIdOrThrow(Model, id, notFoundMessage);
  ensureOwner(doc, userId, ownerField);
  await doc.deleteOne();
};
