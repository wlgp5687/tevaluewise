import * as validation from './validation';
import { check } from 'express-validator/check';
import { validate } from '.';

// id 가 일치하는 과목 조회
export const getSubject = validate([]);

// 검색 조건에 따른 과목 목록 조회(light version)
export const getSubjectList = validate([]);
