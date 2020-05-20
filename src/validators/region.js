import * as validation from './validation';
import { check, oneOf } from 'express-validator/check';
import { validate } from '.';

// 하위 지역 조회
export const getSubRegion = validate([]);

// 인덱스 기준 지역 전체 조회
export const getFullRegionInfoById = validate([]);

// 지역 조회
export const getRegionById = validate([]);
