import * as validation from './validation';
import { check } from 'express-validator/check';
import { validate } from '.';

// SMS 인증 번호 발송
export const postSmsVerify = validate([]);

// SMS 인증 번호 확인
export const getSmsVerify = validate([]);

// 약관 조회
export const getTerm = validate([]);

// 약관 등록
export const postTerm = validate([]);

// 약관 수정
export const patchModificationTerm = validate([]);

// 약관 삭제
export const deleteEliminationTerm = validate([]);
