const toObject = (doc) => (doc?.toObject ? doc.toObject() : doc);

export class CommentDto {
  constructor(comment) {
    const data = toObject(comment) || {};
    this._id = data._id;
    this.content = data.content;
    this.video = data.video;
    this.owner = data.owner;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(comment) {
    return comment ? new CommentDto(comment) : null;
  }

  static fromList(comments = []) {
    return comments.map((comment) => new CommentDto(comment));
  }
}
