export enum FileCategoryEnum {
  CONTAINER_THUMBNAIL = 'CONTAINER_THUMBNAIL',
  CONTAINER_TEMPLATE_THUMBNAIL_USER = 'CONTAINER_TEMPLATE_THUMBNAIL_USER',
  CONTAINER_TEMPLATE_THUMBNAIL_OFFICIAL = 'CONTAINER_TEMPLATE_THUMBNAIL_OFFICIAL',
  CASE_THUMBNAIL = 'CASE_THUMBNAIL',
  WDP_DOWNLOADER = 'WDP_DOWNLOADER',
  WDP_OFFLINE_PACKAGE = 'WDP_OFFLINE_PACKAGE',
}

export const S3_PATH_PREFIX = {
  [FileCategoryEnum.CONTAINER_THUMBNAIL]: 'container/thumbnail/',
  [FileCategoryEnum.CONTAINER_TEMPLATE_THUMBNAIL_USER]:
    'container/template/thumbnail/user/',
  [FileCategoryEnum.CONTAINER_TEMPLATE_THUMBNAIL_OFFICIAL]:
    'container/template/thumbnail/official/',
  [FileCategoryEnum.CASE_THUMBNAIL]: 'case/thumbnail/',
  [FileCategoryEnum.WDP_DOWNLOADER]: 'downloader/',
  [FileCategoryEnum.WDP_OFFLINE_PACKAGE]: 'package/offline/',
};
