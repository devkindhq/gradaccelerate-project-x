import vine from '@vinejs/vine'

export const ImageValidator = vine.compile(
  vine.object({
    image: vine
      .file({
        extnames: ['jpg', 'png', 'webp'],
        size: '10mb', 
      })
      .nullable(),
  })
)
