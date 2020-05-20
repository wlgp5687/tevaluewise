import * as validation from './validation';
import { check, oneOf } from 'express-validator/check';
import { validate } from '.';

// 배너 아이템 조회
export const getBannerItems = validate([]);

// 배너 코드 List 조회
export const getBannerCodeList = validate([]);

// 배너 등록
export const setBannerItems = validate([]);

// 배너 조회
export const getBanners = validate([]);
