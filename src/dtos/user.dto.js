const toObject = (doc) => (doc?.toObject ? doc.toObject() : doc);

/**
 * @description User DTO (safe fields only)
 */
export class UserDto {
  constructor(user) {
    const data = toObject(user) || {};
    this._id = data._id;
    this.username = data.username;
    this.email = data.email;
    this.fullName = data.fullName;
    this.avatar = data.avatar;
    this.coverImage = data.coverImage;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(user) {
    return user ? new UserDto(user) : null;
  }

  static fromList(users = []) {
    return users.map((user) => new UserDto(user));
  }
}
