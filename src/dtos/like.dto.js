const toObject = (doc) => (doc?.toObject ? doc.toObject() : doc);

export class LikeDto {
  constructor(like) {
    const data = toObject(like) || {};
    this._id = data._id;
    this.likedBy = data.likedBy;
    this.video = data.video;
    this.comment = data.comment;
    this.tweet = data.tweet;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(like) {
    return like ? new LikeDto(like) : null;
  }

  static fromList(likes = []) {
    return likes.map((like) => new LikeDto(like));
  }
}
