const toObject = (doc) => (doc?.toObject ? doc.toObject() : doc);

export class PlaylistDto {
  constructor(playlist) {
    const data = toObject(playlist) || {};
    this._id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.owner = data.owner;
    this.videos = data.videos;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static from(playlist) {
    return playlist ? new PlaylistDto(playlist) : null;
  }

  static fromList(playlists = []) {
    return playlists.map((playlist) => new PlaylistDto(playlist));
  }
}
