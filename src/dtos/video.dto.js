const toObject = (doc) => (doc?.toObject ? doc.toObject() : doc);

export class VideoDto {
  constructor(video) {
    const data = toObject(video) || {};
    this._id = data._id;
    this.title = data.title;
    this.description = data.description;
    this.videoFile = data.videoFile;
    this.thumbnail = data.thumbnail;
    this.owner = data.owner;
    this.views = data.views;
    this.duration = data.duration;
    this.isPublished = data.isPublished;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(video) {
    return video ? new VideoDto(video) : null;
  }

  static fromList(videos = []) {
    return videos.map((video) => new VideoDto(video));
  }
}
