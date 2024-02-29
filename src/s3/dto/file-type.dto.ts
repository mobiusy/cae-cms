export enum FileCategoryEnum {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  THUMBNAIL = 'THUMBNAIL',
  PROFILE = 'PROFILE',
}

export const S3_PATH_PREFIX = {
  [FileCategoryEnum.AUDIO]: 'audio/',
  [FileCategoryEnum.VIDEO]: 'video/',
  [FileCategoryEnum.THUMBNAIL]: 'thumbnail/',
  [FileCategoryEnum.PROFILE]: 'profile/',
};
