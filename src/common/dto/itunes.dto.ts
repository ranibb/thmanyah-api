// DTO for a single podcast from the search results
export interface ItunesPodcast {
  collectionId: number;
  artistName: string;
  collectionName: string;
  feedUrl: string;
  artworkUrl600: string;
  genres: string[];
  releaseDate: string;
  trackCount: number;
}

// DTO for the entire response from the iTunes Search API
export interface ItunesSearchResponse {
  resultCount: number;
  results: ItunesPodcast[];
}
