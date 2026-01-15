const toObject = (doc) => (doc?.toObject ? doc.toObject() : doc);

export class SubscriptionDto {
  constructor(subscription) {
    const data = toObject(subscription) || {};
    this._id = data._id;
    this.subscriber = data.subscriber;
    this.channel = data.channel;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(subscription) {
    return subscription ? new SubscriptionDto(subscription) : null;
  }

  static fromList(subscriptions = []) {
    return subscriptions.map((subscription) => new SubscriptionDto(subscription));
  }
}
