import type { SongGenerationDetails } from '../schema'

export const responseData = <T extends Partial<SongGenerationDetails>>(
  overrides: T = {} as T
) =>
  ({
    code: 200,
    msg: 'success',
    data: {
      taskId: '5c79****be8e',
      parentMusicId: '',
      param:
        '{"prompt":"A calm piano track","style":"Classical","title":"Peaceful Piano","customMode":true,"instrumental":true,"model":"V3_5"}',
      response: {
        taskId: '5c79****be8e',
        sunoData: [
          {
            id: '8551****662c',
            audioUrl: 'https://example.cn/****.mp3',
            streamAudioUrl: 'https://example.cn/****',
            imageUrl: 'https://example.cn/****.jpeg',
            prompt: '[Verse] 夜晚城市 灯火辉煌',
            modelName: 'chirp-v3-5',
            title: '钢铁侠',
            tags: 'electrifying, rock',
            createTime: '2025-01-01 00:00:00',
            duration: 198.44,
          },
        ],
      },
      status: 'SUCCESS',
      type: 'GENERATE',
      errorCode: null,
      errorMessage: null,
    },
    ...overrides,
  }) satisfies SongGenerationDetails

export const mockGetSongsByTaskIdResponse = <
  T extends Partial<SongGenerationDetails>,
>(
  overrides: T = {} as T
) =>
  Promise.resolve(
    new Response(JSON.stringify(responseData(overrides)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  )
