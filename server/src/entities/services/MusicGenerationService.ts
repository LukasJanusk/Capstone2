import type { Song } from '../song'

export interface MusicGenerationService {
  getSongs?: (...args: any[]) => Promise<Song[]>
  extendSong?: (...args: any[]) => Promise<string | Song[]>
  requestSong: (...args: any[]) => Promise<any>
}
