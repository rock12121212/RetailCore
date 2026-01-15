const toObject = (doc) => (doc?.toObject ? doc.toObject() : doc);

export class TweetDto {
  constructor(tweet) {
    const data = toObject(tweet) || {};
    this._id = data._id;
    this.content = data.content;
    this.owner = data.owner;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(tweet) {
    return tweet ? new TweetDto(tweet) : null;
  }

  static fromList(tweets = []) {
    return tweets.map((tweet) => new TweetDto(tweet));
  }
}
